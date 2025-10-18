export async function load({ parent }) {
    const { session } = await parent();
    const sesionActiva = session !== null;

    return {
        session,
        sesionActiva
    };
}