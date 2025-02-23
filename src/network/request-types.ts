const baseCredParams: RequestInit = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
};

export const getParams: RequestInit = {
    method: 'GET',
    ...baseCredParams
};

export const postParams: RequestInit = {
    method: 'POST',
    ...baseCredParams
};

export const patchParams: RequestInit = {
    method: 'PATCH',
    ...baseCredParams
};

export const deleteParams: RequestInit = {
    method: 'DELETE',
    ...baseCredParams
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPostWithBodyParams(body?: any): RequestInit {
    return {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        },
        body: JSON.stringify(body)
    };
}