export const ROLES = { ADMIN: 1, GERENTE: 2, CAJERO: 3 } as const;
export function canCreateRole(actor: number, target: number) {
  return (actor === ROLES.ADMIN && (target === ROLES.GERENTE || target === ROLES.CAJERO)) ||
    (actor === ROLES.GERENTE && target === ROLES.CAJERO);
}
export function canAccessPage(role: number, path: string) {
  if (![1, 2, 3].includes(role)) return false;
  if (path === '/register' || path === '/test-register' || path === '/usuarios') return role !== ROLES.CAJERO;
  return role !== ROLES.CAJERO || path === '/sales' || path === '/pos';
}
