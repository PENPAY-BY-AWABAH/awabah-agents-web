/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import useHttpHook from "@/app/includes/useHttpHook";
import { CONSTANT, placeHolderAvatar, ROUTES } from "@/app/includes/constants";
import { BackIcon } from "@/app/assets/back-icon";
import BaseInput from "@/app/components/baseInput";
import BaseButton from "@/app/components/baseButton";
import { BaseHorizontalIndicator } from "@/app/components/baseHorizontalIndicator";
import { OtpSection } from "./components/otpSection";
import { NextOfKinPage } from "./components/nextOfKin";
import { SuccessComponent } from "./components/success";
import { PaymentComponent } from "./components/payment";
import { ReturnAllNumbers, ValidateEmail } from "@/app/includes/functions";
import { BaseLoader } from "@/app/components/baseLoader";
import BaseSelect from "@/app/components/baseSelect";
import { ItemProps, StateLGAProp } from "@/app/includes/types";
import { Calendar, CameraIcon, CheckCircle, UploadIcon } from "lucide-react";
import { ImagePickerOption } from "./components/imagePickerOption";
import { CameraView } from "./components/cameraView";
import BaseInputDate from "@/app/components/baseInputDate";
import dayjs from "dayjs";
import { opacity } from "html2canvas/dist/types/css/property-descriptors/opacity";
import { ConsentPage } from "./components/consent";
import BaseModal from "@/app/components/baseModal";
import { title } from "process";
type RegisterProps = "User Details" | "Verify Email" | "Next Of Kin" | "Success" | "Pay" | "Employment Details" | "Parent / Guardian Details" | "Bank Details" | "Consent Agreement";
export interface SignUpProps {
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    nin?: string;
    bvn?: string;
    rsaPin?: string;
    trackingId?: string;
    tempPIN?: string;
    nextOfKinRegisteredNotFound?: boolean;
    registrationCompleted?: boolean;
    hasBVN?: boolean;
    pfaCode?: string;
    pfaName?: string;
    serviceNo?: string;
    serviceTitle?: string;
    photo?: string;
    signature?: string;
    country?: string;
    state?: string;
    lga?: string;
    dob?: string;
    gender?: string;
}

const Page = () => {
    const fileUploadInputRef = useRef<HTMLInputElement>(null);
    const signatueInputRef = useRef<HTMLInputElement>(null);
    const [listOfConsent, setListOfConsent] = useState<ItemProps[]>([]);
    const [index, setIndex] = useState<number>(0)
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const [userIsAgent, setUserIsAgent] = useState<boolean>(false);
    const [showOption, setShowOption] = useState<boolean>(false);
    const [userIsMinor, setUserMinor] = useState<boolean>(false);
    const [showState, setShowState] = useState<boolean>(false);
    const [showAddress, setShowAddress] = useState<boolean>(false);
    const [listOfLGA, setListOfLGA] = useState<string[]>([]);
    const [section, setSection] = useState<RegisterProps>("User Details")
    const navigate = useRouter();
    const { handleRegisterUser, ShowMessage, getUserByEmail, loading, GetListOfPFA, RequestForRSAPIN, GetListOfSectors,GetListOfStates } = useHttpHook();
    const [formData, setFormData] = useState<SignUpProps>({
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        nin: "",
        bvn: "",
        rsaPin: "",
        trackingId: "",
        tempPIN: "",
        nextOfKinRegisteredNotFound: true,
        registrationCompleted: false,
        pfaCode: "",
        pfaName: "",
        serviceTitle: "",
        serviceNo: "",
        country: "Nigeria",
        state: "",
        lga: "",
        signature: "",
        gender: ""
    })

    const handleSubmit = (e?: FormEvent) => {
        if(e)
        {
        e.preventDefault();
        }
        const data = {
            ...formData,
            userType: userIsMinor ? "MINOR" : "ADULT"
        };
          
        if (userIsMinor) {
            data.dob = dayjs(data.dob).format("DD-MM-YYYY")
        }
        
        if(data.userType === "MINOR")
        {
            if(formData?.state === "" || formData?.lga === "")
            {
            return setShowState(true)
            }
            if(formData?.address === "")
            {
            return setShowAddress(true)
            }
        }
        setShowState(false);
        setShowAddress(false);
        handleRegisterUser(data).then((res) => {
           
            if (res.status) {
                const data = {
                    ...formData,
                    ...res.data
                }
                setFormData(data);
                if(res.data?.rsaPin)
                {
                    return setSection("Success")
                }
                return setSection("Next Of Kin")
            }else{
                if(res.data?.lgaNotFound === true || res.data?.stateNotFound === true || res.data?.countryNotFound === true)
                {
                  setShowState(true);
                }else if(res.data?.addressNotFound === true)
                {
                  setShowAddress(true);
                }
            }
        })
    }
    const [listOfStates, setListOfStates] = useState<StateLGAProp[]>([]);
    const [avatar, setAvatar] = useState<string>("");
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
    useEffect(() => {
        if (section === "User Details") {
            setIndex(0)
        }
        if (section === "Next Of Kin") {
            setIndex(1)
        }
        if (section === "Consent Agreement") {
            setIndex(2)
        }
        if (section === "Pay") {
            setIndex(3)
        }
        if (section === "Success") {
            setIndex(4)
        }
    }, [section])

    useEffect(() => {
        if (email) {
            getUserByEmail(email).then((res) => {
                if (res.data?.nextOfKinRegisteredNotFound === true) {
                    setSection("Next Of Kin")
                }
                setFormData({
                    ...res.data,
                    phoneNumber: String(res.data?.phoneNumber).replace("+234", "0"),
                    trackingId: res.data?.trackingId
                })
            })
        }
    }, [email])

    const handleRSAPIN = (e: FormEvent) => {
        e.preventDefault()
        if (formData.rsaPin !== "") {
            return ShowMessage({ status: false, message: String(formData.rsaPin).includes("AWA") ? "User already registered for RSA PIN" : "User already had RSA PIN", data: null, position: "center" })
        }

        RequestForRSAPIN({ email: formData.email!, bvn: formData.bvn }).then((res) => {
            if (res.data?.nextOfKinRegisteredNotFound === false) {
                return setSection("Next Of Kin")
            }
            if (res.status) {
                setFormData({
                    ...formData,
                    ...res.data
                })
                return setSection("Success")
            }
            ShowMessage({ ...res, message: String(res.message).replace("NIN and ", ""), position: "center" })
        })
    }
   
    const [pfaList,setPfaList] = useState<ItemProps[]>([]);
    
    const ListOfSectors = () => {
        GetListOfSectors().then((res) => {
            if (res.status) {
                //set list of banks
                const data = res.data.map((a: any) => {
                    return {
                        title: a.Sector,
                        name: a.Sector,
                        value: a.EmployerCode
                    }
                })
                setListOfConsent(data);
            }
        })
    }
     const GetPFAList = () => {
        GetListOfPFA().then((res) => {
            if (res.status) {
                setPfaList(res.data.map((a:any)=>{
                    return {
                        ...a,
                        value:a.code
                    }
                }));
            }
        })
    }
    useEffect(() => {
        ListOfSectors();
        GetPFAList();
    }, []);

    useEffect(() => {
        if (formData.photo) {
            setAvatar(formData.photo)
        } else {
            setAvatar(placeHolderAvatar.src)
        }
    }, [formData.photo])

    const triggerClick = () => {
        // Safely trigger the hidden input
        if (fileUploadInputRef.current) {
            fileUploadInputRef.current?.click();
        }
    };
const GetStates = ()=>{
    GetListOfStates().then((res) => {
        if (res.status) {
            setListOfStates(res.data);
            if (res.data.length !== 0) {
            const state = res.data[0];
            setListOfLGA(state.lgas.map((a: any) => {
                return a.name
            }))
            setFormData({
                ...formData,
                state: state.StateName
            })
        }
        }
    })
}
   

    const reduceImageSize = (base64String: string, quality: number = 0.7, maxWidth: number = 1000, maxHeight: number = 1000): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64String;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                }

                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };
        });
    };

    const handleFileChange = (e: any) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            console.log("Selected file:", selectedFile.name);
            //   uploadFile(selectedFile);
            if (selectedFile) {
                const reader = new FileReader();
                // This event fires when the file is successfully read
                reader.onload = async function (e: any) {
                    const base64String = e.target.result;
                    const compressedBase64 = await reduceImageSize(base64String, 0.7, 100, 100);
                    setAvatar(compressedBase64);
                    setFormData({
                        ...formData,
                        photo: compressedBase64
                    })

                };
                reader.readAsDataURL(selectedFile);
            }
        }
    };

    const handleSignatureChange = (e: any) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            if (selectedFile) {
                const reader = new FileReader();
                // This event fires when the file is successfully read
                reader.onload = async (e: any) => {
                    const base64String = e.target.result;
                    const compressedBase64 = await reduceImageSize(base64String, 0.7, 100, 100)
                    setFormData({
                        ...formData,
                        signature: compressedBase64
                    })
                };
                reader.readAsDataURL(selectedFile);
            }
        }
    };

    useEffect(() => {
        if (formData.email !== "" || formData.photo) {
            localStorage.setItem(CONSTANT.LocalStore.userFormFields, JSON.stringify(formData))
        } else {
            const formFields = localStorage.getItem(CONSTANT.LocalStore.userFormFields);
            if (formFields) {
                setFormData(JSON.parse(formFields));
            }
        }
    }, [formData])

    useEffect(() => {
        GetStates();
    }, [])

    return <div className="bg-white h-full lg:px-[100px] lg:py-[60px] overflow-none">
        {section !== "Success" && <div className="mb-6">
            <button
                onClick={() => {
                    if (section === "User Details") {
                        return navigate.back();
                    }
                    if (section === "Verify Email") {
                        return setSection("User Details");
                    }
                    if (section === "Next Of Kin") {
                        return setSection("User Details")
                    }

                    if (section === "Consent Agreement") {
                        return setSection("Next Of Kin")
                    }

                    if (section === "Pay") {
                        return setSection("Consent Agreement")
                    }

                    navigate.back();
                }}
                className="flex items-center gap-2 cursor-pointer">
                <span className="hidden lg:block" >
                    <BackIcon />
                </span>
                <span className="lg:hidden">
                    <BackIcon size={30} />
                </span>
                <div className="text-black text-[18px]">Back</div>
            </button>
        </div>}
        {section !== "Success" ? <div className="m-auto items-center text-center h-full overflow-x-scroll">
            <div className="m-auto items-center text-center  rounded-[30px] min-h-[400px] py-[16px] shadow lg:w-[500px] lg:p-[30px] pb-[180px] lg:pb-[60px]">
                <div className="text-black text-[24px] font-bold text-center mb-[20px] ">{section}</div>
                <div className="w-[200px]">
                    <BaseHorizontalIndicator
                        count={5}
                        selectedIndex={index}
                    />
                </div>
                {section === "User Details" && <div className="mt-[20px]">
                    {userIsAgent ? <form
                        className="mt-5"
                        onSubmit={handleRSAPIN}
                    >
                        <div className="text-[#909090] text-[12px] text-left">{String(formData.rsaPin).includes("AWA") ? "Agent already has a temporary PIN" : String(formData.rsaPin).includes("PEN") ? "Agent already has a RSA PIN" : "Request RSA PIN for this Agent."}</div>
                        <div className="text-[#009668] text-[14px] text-left mt-4">Details</div>
                        <BaseInput
                            type="text"
                            name="email"
                            value={formData.email}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    email: value
                                })
                            }}
                            max={140}
                            label="Email"
                            placeholder="Enter Email."
                            onBlur={() => {
                                // HandleCheckEmail(String(formData.email).trim())
                            }}
                        />
                        {/* {!formData.hasBVN && <BaseInput
                            type="text"
                            name="BVN"
                            value={formData.bvn}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    bvn: value
                                })
                            }}
                            max={11}
                            label={`BVN`}
                            placeholder="Enter BVN."
                        />} */}
                         
                        <BaseInput
                            type="text"
                            name="firstName"
                            disabled
                            value={formData.firstName}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    firstName: value
                                })
                            }}
                            max={40}
                            label="First Name"
                            placeholder="Enter First Name."
                        />
                        <BaseInput
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            required
                            disabled
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    lastName: value
                                })
                            }}
                            max={40}
                            label="Last Name"
                            placeholder="Enter last name."
                        />

                        <div className="mt-5" >
                            <BaseButton
                                disabled={formData.rsaPin !== ""}
                                text="Request RSA PIN"
                                type="submit"
                            />
                        </div>
                    </form> : <div>
                        <div className="text-[#909090] text-[12px] text-left">Please provide some information about the user, these information are used to protect users account and for compliance purpose.</div>
                        <div className="text-[#009668] text-[14px] text-left mt-4">Personal Details</div>
                        <div className="flex items-center mt-5 border-[2px] border-green-700 rounded-md">
                            <button
                                onClick={() => { setUserMinor(false) }}
                                className={`cursor-pointer text-[12px] ${userIsMinor ? "text-green-700" : "bg-green-700 text-white"}  text-center px-5 py-2 flex-grow`}>Adult</button>
                            <button
                                onClick={() => {
                                    setUserMinor(true)
                                }}
                                className={`cursor-pointer text-[12px] ${userIsMinor ? "bg-green-700 text-white" : "text-green-700"} text-center px-5 py-2  flex-grow`}>Minor</button>
                        </div>
                        <form onSubmit={handleSubmit}
                            className="mt-5"
                        >
                            <div
                                className="w-[120px] relative cursor-pointer m-auto h-[120px] bg-gray-100 rounded-[120px] border-[3px] border-green-600"
                            >
                                {!formData.photo && <input
                                    required={!formData.photo}
                                    ref={fileUploadInputRef}
                                    type="file"
                                    onChange={handleFileChange}
                                    style={{ opacity: 0, position: "absolute", bottom: 70, width: 10, height: 10 }}
                                    accept="image/*"
                                />}
                                {formData.photo?<img
                                    className="w-full object-cover cursor-pointer m-auto h-full bg-gray-100 rounded-[120px] "
                                    alt="avatar"
                                    src={formData.photo}
                                    onClick={() => setShowCamera(true)}
                                />:<img
                                    className="w-full object-cover cursor-pointer m-auto h-full bg-gray-100 rounded-[120px] "
                                    alt="avatar"
                                    src={placeHolderAvatar.src}
                                    onClick={() => setShowCamera(true)}
                                />}
                                <CameraIcon className="absolute bottom-[-10px] right-[-10px]"
                                    onClick={() => setShowCamera(true)}
                                />
                            </div>
                            <div
                                className={`px-[16px] mt-[20px]`}
                            >
                                <div className="text-left mb-4" >
                                    <BaseSelect
                                        label="Pension Fund Administrator (PFA)"
                                        list={pfaList}
                                        placeholder="Select a Pension Fund Administrator"
                                        name="pfa"
                                        required
                                        left
                                        onValueChange={({ value }) => {
                                            const foundItem = pfaList.find((a) => a.value === value);
                                            if (foundItem) {
                                                setFormData((prev) => {
                                                    return {
                                                        ...prev,
                                                        pfaCode: value,
                                                        pfaName: foundItem?.title
                                                    }
                                                })
                                            }
                                        }}
                                        value={formData.pfaName!}
                                        className=""
                                        custom
                                    />
                                </div>
                                {/* <BaseInput
                            type="text"
                            name="email"
                            value={formData.email}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    email: value
                                })
                              
                            }}
                            max={140}
                            label="Email"
                            placeholder="Enter Email."
                            onBlur={()=>{
                            //   HandleCheckEmail(String(formData.email).trim())
                            }}
                        /> */}
                       {userIsMinor && <BaseInput
                        disabled={formData.hasBVN}
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    firstName: value
                                })
                            }}
                            max={40}
                            label="First Name"
                            placeholder="Enter First Name."
                             onBlur={()=>{
                                // HandleCheckEmail(String(formData.email).trim())
                            }}
                        /> }
                        {userIsMinor && <BaseInput
                        disabled={formData.hasBVN}
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    lastName: value
                                })
                            }}
                            max={40}
                            label="Last Name"
                            placeholder="Enter last name."
                        />}
                                
                                {showState && <BaseModal 
                                title="State and Local Goverment Area"
                                onClose={()=>setShowState(false)}
                                >
                                <div >
                                <div className="text-left mb-4" >
                                    <BaseSelect
                                        label="State"
                                        list={listOfStates.map((a: StateLGAProp, i: number) => {
                                            return {
                                                name: a.StateName,
                                                title: a.StateName,
                                                value: a.StateName
                                            }
                                        }) as ItemProps[]}
                                        placeholder="Select a state"
                                        name="state"
                                        required
                                        left
                                        onValueChange={({ value }) => {
                                            setFormData({
                                                ...formData,
                                                state: value,
                                                lga: ""
                                            })
                                            const foundItem = listOfStates.find((a, i) => a.StateName === value);
                                            if (foundItem) {
                                                setListOfLGA(foundItem.lgas.map((a: any) => {
                                                    return a.name
                                                }))
                                            }
                                        }}
                                        value={formData.state!}
                                        custom
                                    />
                                </div>
                                <div className="text-left mb-4" >
                                    <BaseSelect
                                        label="LGA"
                                        list={listOfLGA.map((a, i) => {
                                            return {
                                                title: a,
                                                name: a,
                                                value: a
                                            }
                                        }) as ItemProps[]}
                                        placeholder="Select a LGA"
                                        name="lga"
                                        required
                                        left
                                        onValueChange={({ value }) => {
                                            setFormData({
                                                ...formData,
                                                lga: value
                                            })
                                        }}
                                        value={formData.lga!}
                                        className=""
                                        custom
                                    />
                                </div>
                                <BaseButton 
                                text="Continue"
                                disabled={!formData.state || !formData.lga}
                                onClick={()=>{
                                    handleSubmit()
                                }}
                                type="button"
                                />
                                </div>
                                </BaseModal>}
                        {!userIsMinor &&<BaseInput
                        disabled={formData.hasBVN}
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    phoneNumber: value
                                })
                            }}
                            max={11}
                            label="Phone Number"
                            placeholder="Enter phone number."
                        />}
                        <BaseInput
                                    type="text"
                                    name="nin"
                                    className="bg-white"
                                    value={formData.nin}
                                    required
                                    max={11}
                                    onValueChange={({ value }) => {
                                        setFormData({
                                            ...formData,
                                            nin: value
                                        })
                                    }}
                                    label="NIN (National Identification Number)"
                                    placeholder="Enter NIN."
                                />
                        {showAddress && <BaseModal
                        title="Postal address"
                        onClose={()=>setShowAddress(false)}
                        >
                        <div>
                        <BaseInput
                            type="text"
                            name="address"
                            value={formData.address}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    address: value
                                })
                            }}
                            onBlur={()=>{
                               
                            }}
                            max={140}
                            label="Address"
                            placeholder="Enter address."
                        />
                        <BaseButton 
                        text="Continue"
                        type="button"
                        disabled={!formData.address}
                        onClick={()=>{
                          handleSubmit()
                        }}
                        />
                        </div>
                        </BaseModal>}
                            </div>
                            <div className={`w-full ${userIsMinor ? "bg-green-200 p-3 rounded-[20px] mb-2 " : "px-[16px]"}`} >
                                {userIsMinor && <div className="w-full text-left text-green-700 mb-2 font-bold">Parent / Guardian Details</div>}
                        {userIsMinor &&<BaseInput
                        disabled={formData.hasBVN}
                            type="text"
                            name="phoneNumber"
                            className="bg-white"
                            value={formData.phoneNumber}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    phoneNumber: value
                                })
                            }}
                            max={11}
                            label="Phone Number"
                            placeholder="Enter phone number."
                        />} 
                        {/* {userIsMinor &&<BaseInput
                            type="text"
                            name="email"
                            value={formData.email}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    email: value
                                })
                              
                            }}
                            className="bg-white"
                            max={140}
                            label="Email"
                            placeholder="Enter Email."
                            onBlur={()=>{
                              
                            }}
                        />} */}

                                {/* {userIsMinor &&<BaseInput
                            type="text"
                            name="address"
                            className="bg-white"
                            value={formData.address}
                            required
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    address: value
                                })
                            }}

                           onBlur={()=>{
                                const splitAddress = String(formData.address).trim().split(" ");
                                if(splitAddress.length == 1)
                                {
                                     setFormData({
                                    ...formData,
                                    address: ""
                                })
                                ShowMessage({status:false,message:"Invalid postal address",position:"center",data:null})
                                }
                            }} 
                            max={140}
                            label="Address"
                            placeholder="Enter address."
                        />} */}
                                {userIsMinor ? <BaseInput
                                    type="text"
                                    name="rsaPin"
                                    className="bg-white"
                                    value={formData.rsaPin}
                                    required
                                    max={15}
                                    onValueChange={({ value }) => {
                                        setFormData({
                                            ...formData,
                                            rsaPin: value
                                        })
                                    }}
                                    label="RSA PIN"
                                    placeholder="Enter RSA PIN."
                                /> :null}
                        {/* {!formData.hasBVN && !userIsMinor &&<BaseInput
                            type="text"
                            name="bvn"
                            className="bg-white"
                            value={formData.bvn}
                            required
                            max={11}
                            onValueChange={({ value }) => {
                                setFormData({
                                    ...formData,
                                    bvn: ReturnAllNumbers(value)
                                })
                            }}
                            label="BVN (Bank Verification Number)"
                            placeholder="Enter BVN."
                        />} */}
                       
                                {userIsMinor && <div className="text-left mb-4 " >
                                    <BaseSelect
                                        custom
                                        placeholder="Job Type"
                                        name="serviceNo"
                                        className="bg-white"
                                        value={formData.serviceTitle!}
                                        required
                                        onValueChange={({ value }) => {
                                            const foundItem = listOfConsent.find((a) => a.value === value)
                                            if (foundItem) {
                                                setFormData({
                                                    ...formData,
                                                    serviceNo: value,
                                                    serviceTitle: foundItem?.title
                                                })
                                            }
                                        }}
                                        left
                                        list={listOfConsent}
                                        label="Select your Job type"
                                    />
                                </div>}
                            </div>
                            <div
                                className={`px-[16px]`}
                            >
                           
                                {!userIsMinor && <div className="text-left mb-4 mt-3" >
                                    <BaseSelect
                                        custom
                                        placeholder="Job Type"
                                        name="serviceNo"
                                        className="bg-white"
                                        value={formData.serviceTitle!}
                                        required
                                        onValueChange={({ value }) => {
                                            const foundItem = listOfConsent.find((a) => a.value === value)
                                            if (foundItem) {
                                                setFormData({
                                                    ...formData,
                                                    serviceNo: value,
                                                    serviceTitle: foundItem?.title
                                                })
                                            }
                                        }}
                                        left
                                        list={listOfConsent}
                                        label="Select your Job type"
                                    />
                                </div>}
                                <div className={`mb-5 h-[45px] mt-5 overflow-hidden flex gap-2 cursor-pointer items-center justify-center block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm relative `}
                                >
                                    {!formData?.signature ? <UploadIcon /> : <CheckCircle color="green" />}
                                    <div className={`${formData?.signature ? "text-green-700" : "text-black"}`} >{formData?.signature ? "Change Signature" : "Upload Signature"}</div>
                                    <input
                                        required={!formData.signature}
                                        ref={signatueInputRef}
                                        type="file"
                                        onChange={handleSignatureChange}
                                        className="absolute top-[0px] opacity-0
                                left-[0px]
                                w-full
                                h-[40px]
                                cursor-pointer
                                "
                                        accept="image/*"
                                    />
                                </div>
                                <div className="mb-[120px]">
                                    <BaseButton
                                        text="Next"
                                        type="submit"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>}
                {loading && <BaseLoader modal color="green" size="lg" />}
                </div>}
                {section === "Verify Email" && <div >
                    <OtpSection
                        email={formData.email!}
                        trackingId={formData.trackingId!}
                        onClose={() => {
                            if (formData.nextOfKinRegisteredNotFound === true) {
                                return setSection("Next Of Kin")
                            }
                            setSection("Next Of Kin")
                        }}
                        userIsMinor={userIsMinor}
                    />
                </div>}
                {section === "Next Of Kin" && <div >
                    <NextOfKinPage
                        onClose={() => {
                            setSection("Verify Email")
                        }}
                        onSuccess={(data) => {
                            setFormData({
                                ...formData,
                                ...data
                            })
                            setSection("Consent Agreement")
                        }}
                        trackingId={formData.trackingId!}
                        userIsMinor={userIsMinor}
                    />
                </div>}

                {section === "Pay" && <div >
                    <PaymentComponent
                        onSuccess={() => {
                            setSection("Success")
                        }}
                        userdata={formData}
                    />
                </div>}
                {section === "Consent Agreement" && <div >
                    <ConsentPage
                        onSuccess={({ rsaPin }) => {
                            setFormData({
                                ...formData,
                                rsaPin
                            })
                            setSection("Pay")
                        }}
                        onClose={() => {

                        }}
                        trackingId={formData.trackingId!}
                        email={formData.email!}
                        userData={formData}
                    />
                </div>}
                {/* {section === "Employment Details" && <div >
                    <EmploymentPage
                        onSuccess={(tempPIN) => {
                        update({showCommissionBalance:true});
                        setFormData({
                            ...formData,
                            tempPIN
                        })
                        setSection("Success")
                        }}
                        onClose={() => {

                        }}
                        trackingId={formData.trackingId!}
                    />
                </div>} */}
                {/* {section === "Parent / Guardian Details" && <div >
                    <ParentDetailPage
                        onSuccess={() => {
                        setSection("Pay")
                        }}
                        isFather={true}
                        onClose={() => {

                        }}
                        trackingId={formData.trackingId!}
                    />
                </div>}
                */}
            </div>
        </div> : <SuccessComponent
            onPay={() => {
                localStorage.setItem(CONSTANT.LocalStore.remit, JSON.stringify({
                    rsaPin: formData.rsaPin,
                    pfaName: formData.pfaName,
                    providerId: formData?.pfaCode,
                    phoneNumber: String(formData.phoneNumber).replace("undefined", "").replace("+234", "0"),
                    amount: 3000,
                    fullName: formData.firstName + " " + formData.lastName,
                    isValid: false
                }))
                localStorage.removeItem(CONSTANT.LocalStore.userFormFields);
                localStorage.removeItem(CONSTANT.LocalStore.nextOfKin);
                navigate.push(ROUTES.remit)
            }}
            email={formData.email!}
            userIsAgent={userIsAgent}
            trackingId={formData.trackingId!}
            rsaPin={formData.rsaPin!}
            pfaName={formData?.pfaName}
        />}
        {showOption && <ImagePickerOption
            onSelect={(d: string) => {
                if (d === "gallery") {
                    triggerClick();
                } else {
                    setShowCamera(true)
                }
                setShowOption(false);
            }}
            onClose={() => {
                setShowOption(false);
            }}
        />}
        {showCamera && <CameraView
            onSuccess={(base64: string) => {
                reduceImageSize(base64).then((res) => {
                    setAvatar(base64)
                    setFormData({
                        ...formData,
                        photo: res
                    })
                    setShowCamera(false);
                })
            }}
            onClose={() => {
                setShowCamera(false);
            }}
        />}
    </div>
}
export default Page;