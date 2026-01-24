/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { ReactNode } from "react";

    export interface SlideItemProp {
        id?:string;
        graphics?:ReactNode | string;
        title?:string;
        description?:string;
    }
    export type FieldChangePayload = {
        [x: string]: any;
        field: string;
        value: string;
      };

    export interface LoginProps {
    email?:string;
    password?:string;
    newPassword?:string;
    confirmPassword?:string;
    otp?:string;
    }
    export interface ItemProps {
        name: string | undefined;
        value: string;
        title:string;
        icon?:string | ReactNode;
        description?:string;
        route?:string;
        selected?:boolean;
    }
    export interface BankItemProps {
        id?:string;
        name?:string;
        code?:string;
        longCode?:string;
        country?:string;
        currency?:string;
    }
    export interface SavedAccountProps {
        id?:string;
        accountName?:string;
        accountNumber?:string;
        bankName?:string;
        bankCode?:string;
        createdAt?:string;
    }