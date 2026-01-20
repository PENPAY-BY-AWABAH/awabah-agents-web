import { ReactElement } from "react";

export const ROUTES = {
login:"/login",
forgotPassword:"/forgot-password",
dashboard:"/dashboard",
commission:"/dashboard/commission",
profile:"/dashboard/profile",
userOnboarding:"/dashboard/user-onboarding",
remit:"/dashboard/remit",
history:"/dashboard/history",
withdrawal:"/dashboard/withdrawal",
users:"/dashboard/users",
notification:"/dashboard/notification",
register:"/register",
saveBankAccount:"/dashboard/save-bank-account",
selectBankAccount:"/dashboard/select-bank-account",
addAccount:"/dashboard/add-account",
terms:"/terms-and-conditions",
}
export interface RouteItem {
title:string;
icon?:string | ReactElement;
description?:string;
route?:string;
selected?:boolean;
} 
export const CONSTANT = {
    BaseURL:process.env.NODE_ENV === "development"?"http://localhost/awabah-api/v1/":"https://staging.awabah.com/v1/",
    LocalStore:{
        token:"token",
        baseUrl:"baseurl",
        resetPassword:"resetPassword"
    }
}
export const Currency = {
    symbol:"₦"
}
export const WindowEvents = {
    scheduleList:"scheduleList",
    microPensionList:"microPensionList"
}
export const COLOURS =  {
    green:"[#009668]",
    white:"white"
}
