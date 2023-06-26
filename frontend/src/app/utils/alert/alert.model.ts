export class Alert {
    id!: string;
    message!: string;
    autoClose: boolean = true;
    fade!: boolean;
    alertType!: string;
    closeAction!: any;

    constructor(init?:Partial<Alert> |null) {
        Object.assign(this, init);
    }
}