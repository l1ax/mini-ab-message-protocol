
export const abAuthHook = async (request, options) => {
    request.headers.set('Authorization', `Bearer ${import.meta.env.VITE_AB_API_KEY}`)
}