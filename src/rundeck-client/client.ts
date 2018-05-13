import Axios, { AxiosAdapter, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

interface IClientOpts {
    apiUrl: string
    username?: string
    password?: string
    token?: string
}

interface IUser {
    login: string
    firstName: string
    lastName: string
    email: string
}

interface ISystemInfoResponse {
    system: ISystemInfo
}

interface ISystemInfo {
    timestamp: {
        epoch: number,
        unit: string,
        datetime: string,
    }
    rundeck: {
        version: string,
        build: string,
        node: string,
        base: string,
        apiversion: number,
        serverUUID?: string,
    }
    executions: {
        active: boolean,
        executionMode: string,
    }
    os: {
        arch: string,
        name: string,
        version: string,
    }
    jvm: {
        name: string,
        vendor: string,
        version: string,
        implementation: string,
    }
    stats: {
        uptime: {
            duration: number,
            unit: string,
            since: {
                epoch: number,
                unit: string,
                datetime: string,
            },
        },
        cpu: {
            loadAverage: {
                unit: string,
                average: number,
            },
            processors: number,
        },
        memory: {
            unit: string,
            max: number,
            free: number,
            total: number,
        },
        scheduler: {
            running: number,
            threadPoolSize: number,
       },
       threads: {
           active: number,
       },
    },
    metrics: {
        href: string,
        contentType: string,
    },
    threadDump: {
        href: string,
        contentType: string,
    },
}

export class Client {
    c: AxiosInstance

    private loginProm?: Promise<void>

    constructor(readonly opts: IClientOpts) {
        this.c = Axios.create({
            headers: {
                'Content-Type': 'application/json',
            },
            maxRedirects: 0,
        })
    }

    login() {
        if (! this.loginProm)
            this.loginProm = this._doLogin()
        return this.loginProm
    }

    async listUsers(): Promise<AxiosResponse<IUser[]>> {
        const path = `${this.opts.apiUrl}/api/21/user/list`
        return this.get<IUser[]>(path)
    }

    async systemInfo(): Promise<AxiosResponse<ISystemInfoResponse>> {
        const path = `${this.opts.apiUrl}/api/14/system/info`
        return this.get<ISystemInfoResponse>(path)
    }

    async get<T>(url: string, config?: AxiosRequestConfig) {
        await this.login()
        return await this.c.get<T>(url, config)
    }

    private async _doLogin(): Promise<void> {
        const {apiUrl, username, password} = this.opts
        const path = `${this.opts.apiUrl}/j_security_check?j_username=${username}&j_password=${password}`
        const resp = await this.c.post(path, null, {validateStatus: s => s >= 300 && s <= 400})
        this.c.defaults.headers.Cookie = resp.headers['set-cookie'][0]
    }
}