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

export const ErrorMap:Record<string,string> = {
    "Record not found":"There seems to be some inconsistency with your NIN, kindly visit the nearest NIMC office to resolve this",
    "prembly down":"Your details have been submitted successfully. AWABAH will contact you with your PIN within 24 hours.",
    "nin blocked":"There seems to be some inconsistency with your NIN, kindly visit the nearest NIMC office to resolve this.",
    "nin already registered":"Welcome back! It looks like this NIN is already registered with us. Try logging in to your existing account, or reset your password if you've forgotten it.",
}

export const CONSTANT = {
    BaseURL:"http://localhost/awabah-api/v1/",
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
