export async function getApiDocs() {
  const secured = { security: [{ cookieAuth: [] }] };
  const responses = { '200': { description: 'Correcto' }, '400': { description: 'Datos inválidos' }, '401': { description: 'Sin sesión' }, '403': { description: 'Sin permiso' }, '500': { description: 'Error interno' } };
  return { openapi: '3.0.0', info: { title: 'PACIFICO — Autenticación y roles', version: '2.0.0' },
    components: { securitySchemes: { cookieAuth: { type: 'apiKey', in: 'cookie', name: 'pacifico_session' } } },
    paths: {
      '/api/auth/login': { post: { summary: 'Login de ADMIN (.env) o personal (Supabase)', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email','password'], properties: { email: { type: 'string' }, password: { type: 'string', format: 'password' } } } } } }, responses } },
      '/api/auth/me': { get: { ...secured, summary: 'Perfil de la sesión actual', responses } },
      '/api/auth/logout': { post: { summary: 'Cerrar sesión', responses } },
      '/api/auth/register': { post: { ...secured, summary: 'ADMIN registra gerente/cajero; gerente registra cajero de su sucursal', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name','last_name','email','password','rol_id'], properties: { name: { type: 'string' }, last_name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string', minLength: 8 }, rol_id: { type: 'integer', enum: [2,3] }, branch_id: { type: 'integer' } } } } } }, responses: { ...responses, '201': { description: 'Usuario creado' } } } },
      '/api/roles': { get: { ...secured, summary: 'Roles que puedes registrar', responses } },
      '/api/sucursales': { get: { ...secured, summary: 'ADMIN: todas; gerente: su sucursal; cajero: prohibido', responses } },
      '/api/categorias': { get: { ...secured, summary: 'Categorías para ADMIN y gerente', responses } },
      '/api/usuarios/{id}': { get: { ...secured, summary: 'Perfil propio o autorizado por jerarquía y sucursal', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses } }
    }
  };
}
