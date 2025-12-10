
export const ETNA_API_BASES = {
    intra: "https://intra-api.etna-alternance.net",
    api: "https://api.etna-alternance.net",
    gsa: "https://gsa-api.etna-alternance.net",
    tickets: "https://tickets.etna-alternance.net",
    modules: "https://modules-api.etna-alternance.net"
};

/**
 * Effectue une requête vers l'API ETNA en choisissant la base d'URL.
 * @param path Chemin de l'API (ex: /users)
 * @param options Options fetch
 * @param baseUrl Base d'URL à utiliser (par défaut : api)
 */

function withCookie(options: RequestInit, sessionCookie: string): RequestInit {
    return {
        ...options,
        headers: {
            ...(options.headers || {}),
            Cookie: sessionCookie
        }
    };
}

export function requestIntraApi(path: string, options: RequestInit, sessionCookie: string) {
    return fetch(`${ETNA_API_BASES.intra}${path}`, withCookie(options, sessionCookie));
}

export function requestApi(path: string, options: RequestInit, sessionCookie: string) {
    return fetch(`${ETNA_API_BASES.api}${path}`, withCookie(options, sessionCookie));
}

export function requestGsaApi(path: string, options: RequestInit, sessionCookie: string) {
    return fetch(`${ETNA_API_BASES.gsa}${path}`, withCookie(options, sessionCookie));
}

export function requestTicketsApi(path: string, options: RequestInit, sessionCookie: string) {
    return fetch(`${ETNA_API_BASES.tickets}${path}`, withCookie(options, sessionCookie));
}

export function requestModulesApi(path: string, options: RequestInit, sessionCookie: string) {
    return fetch(`${ETNA_API_BASES.modules}${path}`, withCookie(options, sessionCookie));
}

/**
 * Effectue une connexion à ETNA et récupère le cookie de session.
 * @param username Identifiant ETNA
 * @param password Mot de passe ETNA
 * @returns Le cookie de session (Set-Cookie) si succès, sinon lève une erreur
 */
export async function loginEtna(username: string, password: string): Promise<string> {
    const url = "https://hub.etna-alternance.net/login";
    const body = new URLSearchParams({ username, password });
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
        redirect: "manual",
    });

    if (!response.ok && response.status !== 303) {
        throw new Error(`Échec de la connexion ETNA : ${response.status} ${response.statusText}`);
    }
    const setCookie = response.headers.get("set-cookie");
    if (!setCookie) {
        throw new Error("Aucun cookie de session reçu après connexion.");
    }
    return setCookie;
}