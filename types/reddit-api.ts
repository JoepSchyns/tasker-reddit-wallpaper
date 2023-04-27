export type PREVIEW_IMAGE = {
    source: {
        width: number,
        height: number
    }
}
export type POST = {
    kind: 't3',
    data: {
        id: string,
        permalink: string,
        title: string,
        url: string,
        preview: {
            images: Array<PREVIEW_IMAGE>
        }
    }
}

export type API_RESPONSE = {
    kind: 'Listing',
    data: {
        after: string,
        children: Array<POST>
    }
}
