export type RestreamData = {
    readonly id: number
    readonly channelId: number
    readonly active: boolean
    readonly platform: string
    readonly url: string | null
    readonly streamKey: string
    readonly protocol: string
}