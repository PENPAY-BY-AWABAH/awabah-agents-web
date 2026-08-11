import { ReactElement } from "react";
import avatar  from "../assets/pavatar.png"
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
self_registered:"/self-registration"
}
export interface RouteItem {
title:string;
icon?:string | ReactElement;
description?:string;
route?:string;
selected?:boolean;
value?:string;
} 
export const CONSTANT = {
    BaseURL:"https://staging.awabah.com/v1/",
    LocalStore:{
        token:"token",
        baseUrl:"baseurl", 
        referrer:"referrer",
        resetPassword:"resetPassword",
        remit:"remit",
        userFormFields:"userFormFields",
        historySection:"historySection",
        registrationForm:"registrationForm",
        nextOfKin:"nextOfKin"
    },
    Event:{
        showRegisterOptions:"showRegisterOptions"
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

export const NairaSymbol = "₦";
export const placeHolderAvatar = avatar;
