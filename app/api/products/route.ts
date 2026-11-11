import { NextResponse } from "next/server";
import {
  apiError,
  checkBranches,
  getActor,
  HttpError,
  readAllocations,
  readBody,
  transaction,
  validId,
} from "@/shared/utils/inventory-access";
import { uploadCloudinaryImage,CloudinaryImageError } from "@/shared/utils/cloudinary-upload";
import cloudinary from "@/shared/lib/cloudinary";

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductBranchAllocation:
 *       type: object
 *       required: [branch_id, quantity]
 *       properties:
 *         branch_id:
 *           type: string
 *           example: "1"
 *         quantity:
 *           type: integer
 *           minimum: 0
 *           maximum: 2147483647
 *           example: 20
 *         min_stock:
 *           type: integer
 *           minimum: 0
 *           maximum: 2147483647
 *           example: 5
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear producto y asignarlo a sucursales
 *     description: ADMIN selecciona sucursales de su empresa. GERENTE solo puede seleccionar su sucursal. La operación completa es transaccional.
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, category_id, branches]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sabritas Sal 170g
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Papas fritas con sal
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 25.50
 *               category_id:
 *                 type: string
 *                 example: "2"
 *               foto_public_id:
 *                 type: string
 *                 nullable: true
 *               foto_url:
 *                 type: string
 *                 nullable: true
 *               branches:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   $ref: '#/components/schemas/ProductBranchAllocation'
 *     responses:
 *       201:
 *         description: Devuelve success, data con el producto e inventory con las existencias creadas.
 *       400:
 *         description: Datos no válidos.
 *       401:
 *         description: Sesión inválida.
 *       403:
 *         description: Rol no permitido o sucursal fuera del alcance.
 *       404:
 *         description: Categoría o sucursal no disponible en la empresa.
 *       409:
 *         description: Conflicto con los datos.
 *       500:
 *         description: Error interno.
 */

export async function POST(request: Request) {
  let uploadedPublicId: string | null = null;

  try {
    const actor = await getActor(request, [1, 2]);
    const formData = await request.formData();

    const name = formData.get("name");
    const categoryId = validId(formData.get("category_id"));
    const branchesValue = formData.get("branches");
    const price = formData.get("price");
    const description = formData.get("description");
    const image = formData.get("image");

    if (typeof name !== "string" || !name.trim()) {
      throw new HttpError(400, "El nombre del producto es obligatorio");
    }

    if (
      typeof price !== "string" ||
      !/^\d{1,10}(\.\d{1,2})?$/.test(price)
    ) {
      throw new HttpError(400, "El precio debe ser no negativo y tener máximo dos decimales");
    }

    if (typeof branchesValue !== "string") {
      throw new HttpError(400, "Las sucursales son obligatorias");
    }

    const branches = readAllocations(JSON.parse(branchesValue));

    if (description !== null && typeof description !== "string") {
      throw new HttpError(400, "La descripción debe ser texto");
    }

    if (image !== null && !(image instanceof File)) {
      throw new HttpError(400, "El archivo de imagen no es válido");
    }

    if (image instanceof File) {
      if (!image.type.startsWith("image/")) {
        throw new HttpError(400, "El archivo debe ser una imagen");
      }

      if (image.size > 5 * 1024 * 1024) {
        throw new HttpError(400, "La imagen no debe superar los 5 MB");
      }
    }

    const result = await transaction(async (client) => {
      const category = await client.query(
        `SELECT id
          FROM public.categorias
          WHERE id = $1 AND company_id = $2
          FOR SHARE`,
        [categoryId, actor.company_id],
      );

      if (!category.rows[0]) {
        throw new HttpError(404, "Categoría no encontrada en tu empresa");
      }

      await checkBranches(
        client,
        actor,
        branches.map((item) => item.branch_id),
      );

      let fotoUrl: string | null = null;
      let fotoPublicId: string | null = null;

      if (image instanceof File && image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer());

        const uploaded = await new Promise<{ secure_url: string; public_id: string }>(
          (resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: "productos",
                resource_type: "image",
              },
              (error, result) => {
                if (error || !result) {
                  reject(error ?? new Error("Error al subir la imagen"));
                  return;
                }

                resolve({
                  secure_url: result.secure_url,
                  public_id: result.public_id,
                });
              },
            ).end(buffer);
          },
        );

        fotoUrl = uploaded.secure_url;
        fotoPublicId = uploaded.public_id;
        uploadedPublicId = uploaded.public_id;
      }

      const adminId = actor.rol_id === 1 ? actor.id : actor.admin_id;

      const product = await client.query(
        `INSERT INTO public.productos (
          company_id, name, description, price,
          category_id, foto_public_id, foto_url, admin_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          actor.company_id,
          name.trim(),
          description ?? null,
          price,
          categoryId,
          fotoPublicId,
          fotoUrl,
          adminId,
        ],
      );

      const inventory = [];

      for (const branch of branches) {
        const stock = await client.query(
          `INSERT INTO public.inventario (
            company_id, branch_id, product_id, quantity, min_stock
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *`,
          [
            actor.company_id,
            branch.branch_id,
            product.rows[0].id,
            branch.quantity,
            branch.min_stock ?? 5,
          ],
        );

        inventory.push(stock.rows[0]);
      }

      return { data: product.rows[0], inventory };
    });

    return NextResponse.json(
      { success: "Producto e inventario creados con éxito", ...result },
      { status: 201 },
    );
  } catch (error) {
    if (uploadedPublicId) {
      await cloudinary.uploader.destroy(uploadedPublicId).catch(() => {});
    }

    return apiError(error);
  }
}

/**
 * @swagger
 * /api/products:
 *   put:
 *     summary: Modificar un producto y sus existencias
 *     description: ADMIN puede modificar productos de su empresa. GERENTE también puede modificar productos de su empresa según su alcance. La modificación incluye nombre, descripción, precio, categoría, imagen y opcionalmente el inventario por sucursal.
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id, name, price, category_id]
 *             properties:
 *               product_id:
 *                 type: string
 *                 example: "22"
 *               name:
 *                 type: string
 *                 example: Jersey FC Barcelona Lionel Messi Final Champions League 2015
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Jersey del FC Barcelona utilizado durante la final de la Champions League 2015.
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 1800
 *               category_id:
 *                 type: string
 *                 example: "3"
 *               foto_public_id:
 *                 type: string
 *                 nullable: true
 *               foto_url:
 *                 type: string
 *                 nullable: true
 *                 example: data:image/webp;base64,...
 *               branches:
 *                 type: array
 *                 description: Opcional. Lista de sucursales para actualizar o crear el inventario del producto.
 *                 items:
 *                   $ref: '#/components/schemas/ProductBranchAllocation'
 *     responses:
 *       200:
 *         description: Producto e inventario actualizados correctamente.
 *       400:
 *         description: Datos no válidos.
 *       401:
 *         description: Sesión inválida.
 *       403:
 *         description: Rol no permitido.
 *       404:
 *         description: Producto o categoría no encontrados.
 *       500:
 *         description: Error interno.
 */


export async function PUT(request: Request) {
  let newFotoPublicId: string | null = null;

  try {
    const actor = await getActor(request, [1, 2]);

    const contentType = request.headers.get("content-type") ?? "";
    let body: Record<string, any>;
    let fotoFile: FormDataEntryValue | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      fotoFile = formData.get("image");

      body = Object.fromEntries(
        Array.from(formData.entries()).filter(([key]) => key !== "image"),
      );

      if (typeof body.branches === "string" && body.branches.trim()) {
        try {
          body.branches = JSON.parse(body.branches);
        } catch {
          throw new HttpError(400, "El formato de branches no es válido");
        }
      }
    } else {
      body = await readBody(request);
    }

    const productId = validId(body.product_id);
    const branches = body.branches ? readAllocations(body.branches) : [];

    if (typeof body.name !== "string" || !body.name.trim()) {
      throw new HttpError(400, "El nombre del producto es obligatorio");
    }

    const name = body.name.trim();
    const categoryId = validId(body.category_id);

    if (
      !["number", "string"].includes(typeof body.price) ||
      !/^\d{1,10}(\.\d{1,2})?$/.test(String(body.price))
    ) {
      throw new HttpError(
        400,
        "El precio debe ser no negativo y tener máximo dos decimales",
      );
    }

    if (
      body.description != null &&
      typeof body.description !== "string"
    ) {
      throw new HttpError(400, "La descripción debe ser texto");
    }

    // Las URLs e identificadores de Cloudinary no se reciben del cliente.
    if (body.foto_url !== undefined || body.foto_public_id !== undefined) {
      throw new HttpError(
        400,
        "La imagen debe enviarse mediante el campo foto",
      );
    }

    const result = await transaction(async (client) => {
      const product = await client.query(
        `SELECT id, foto_public_id, foto_url
          FROM public.productos
          WHERE id = $1
            AND company_id = $2
          FOR UPDATE`,
        [productId, actor.company_id],
      );

      if (!product.rows[0]) {
        throw new HttpError(404, "Producto no encontrado en tu empresa");
      }

      const oldFotoPublicId = product.rows[0].foto_public_id;

      const category = await client.query(
        `SELECT id
          FROM public.categorias
          WHERE id = $1
            AND company_id = $2
          FOR SHARE`,
        [categoryId, actor.company_id],
      );

      if (!category.rows[0]) {
        throw new HttpError(
          404,
          "Categoría no encontrada en tu empresa",
        );
      }

      // Subir imagen nueva solamente si se envió una.
      const uploadedImage = await uploadCloudinaryImage(
        fotoFile,
        "productos",
      );

      if (uploadedImage) {
        newFotoPublicId = uploadedImage.foto_public_id;
      }

      const fotoPublicId =
        uploadedImage?.foto_public_id ?? product.rows[0].foto_public_id;

      const fotoUrl =
        uploadedImage?.foto_url ?? product.rows[0].foto_url;

      const updatedProduct = await client.query(
        `UPDATE public.productos
          SET
            name = $1,
            description = $2,
            price = $3,
            category_id = $4,
            foto_public_id = $5,
            foto_url = $6,
            updated_at = NOW()
          WHERE id = $7
            AND company_id = $8
         RETURNING *`,
        [
          name,
          body.description ?? null,
          body.price,
          categoryId,
          fotoPublicId,
          fotoUrl,
          productId,
          actor.company_id,
        ],
      );

      const inventory: Record<string, unknown>[] = [];

      if (branches.length > 0) {
        await checkBranches(
          client,
          actor,
          branches.map((item) => item.branch_id),
        );

        for (const branch of branches) {
          const existingStock = await client.query(
            `SELECT id
              FROM public.inventario
              WHERE product_id = $1
                AND branch_id = $2
                AND company_id = $3`,
            [productId, branch.branch_id, actor.company_id],
          );

          if (existingStock.rows[0]) {
            const updatedStock = await client.query(
              `UPDATE public.inventario
                SET quantity = $1,
                    min_stock = $2,
                    updated_at = NOW()
                WHERE id = $3
               RETURNING *`,
              [
                branch.quantity,
                branch.min_stock ?? 5,
                existingStock.rows[0].id,
              ],
            );

            inventory.push(updatedStock.rows[0]);
          } else {
            const newStock = await client.query(
              `INSERT INTO public.inventario (
                company_id, branch_id, product_id, quantity, min_stock
              )
              VALUES ($1, $2, $3, $4, $5)
              RETURNING *`,
              [
                actor.company_id,
                branch.branch_id,
                productId,
                branch.quantity,
                branch.min_stock ?? 5,
              ],
            );

            inventory.push(newStock.rows[0]);
          }
        }
      }

      return {
        product: updatedProduct.rows[0],
        oldFotoPublicId,
        inventory,
      };
    });

    // Eliminar imagen anterior después de confirmar la actualización.
    if (
      newFotoPublicId &&
      result.oldFotoPublicId &&
      result.oldFotoPublicId !== newFotoPublicId
    ) {
      await cloudinary.uploader
        .destroy(result.oldFotoPublicId)
        .catch(() => {});
    }

    return NextResponse.json(
      {
        success: "Producto actualizado correctamente",
        data: result.product,
        inventory: result.inventory,
      },
      { status: 200 },
    );
  } catch (error) {
    // Si falla la operación, eliminar la imagen nueva.
    if (newFotoPublicId) {
      await cloudinary.uploader.destroy(newFotoPublicId).catch(() => {});
    }

    if (error instanceof CloudinaryImageError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    return apiError(error);
  }
}


/**
 * @swagger
 * /api/products:
 *   delete:
 *     summary: Retirar un producto de sucursales seleccionadas
 *     description: Elimina las filas de inventario y sus existencias en las sucursales seleccionadas. Conserva el catálogo y las ventas anteriores. GERENTE solo puede retirar de su sucursal.
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id]
 *             properties:
 *               product_id:
 *                 type: string
 *                 example: "25"
 *               branch_ids:
 *                 type: array
 *                 minItems: 1
 *                 description: Obligatorio para ADMIN. Para GERENTE puede omitirse y se utiliza su sucursal.
 *                 items:
 *                   type: string
 *                 example: ["1", "2"]
 *     responses:
 *       200:
 *         description: Devuelve success, product_id y data con los registros de inventario retirados.
 *       400:
 *         description: Datos no válidos.
 *       401:
 *         description: Sesión inválida.
 *       403:
 *         description: Rol o sucursal no permitidos.
 *       404:
 *         description: Producto, sucursal o asignación no encontrados.
 *       409:
 *         description: Conflicto con registros relacionados.
 *       500:
 *         description: Error interno.
 */
export async function DELETE(request: Request) {
  try {
    const actor = await getActor(request, [1, 2]);
    const body = await readBody(request);
    const productId = validId(body.product_id);

    const requestedBranches =
      body.branch_ids === undefined && actor.rol_id === 2 ? [actor.branch_id] : body.branch_ids;

    if (!Array.isArray(requestedBranches) || requestedBranches.length === 0) {
      throw new HttpError(400, "Debes enviar branch_ids");
    }

    const branchIds = requestedBranches.map(validId);

    if (new Set(branchIds).size !== branchIds.length) {
      throw new HttpError(400, "No repitas sucursales");
    }

    const removed = await transaction(async (client) => {
      const product = await client.query(
        `SELECT id
                FROM public.productos
                WHERE id = $1 AND company_id = $2
                FOR UPDATE`,
        [productId, actor.company_id],
      );

      if (!product.rows[0]) {
        throw new HttpError(404, "Producto no encontrado en tu empresa");
      }

      await checkBranches(client, actor, branchIds);

      const result = await client.query(
        `DELETE FROM public.inventario
                WHERE company_id = $1
                    AND product_id = $2
                    AND branch_id = ANY($3::bigint[])
                 RETURNING *`,
        [actor.company_id, productId, branchIds],
      );

      // Si falta alguna asignación, se revierte toda la operación.
      if (result.rows.length !== branchIds.length) {
        throw new HttpError(
          404,
          "El producto no está asignado a todas las sucursales seleccionadas",
        );
      }

      return result.rows;
    });

    return NextResponse.json({
      success: "Producto retirado de las sucursales seleccionadas",
      product_id: productId,
      data: removed,
    });
  } catch (error) {
    return apiError(error);
  }
}

