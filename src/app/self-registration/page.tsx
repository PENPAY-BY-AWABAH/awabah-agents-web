/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useRouter } from "next/navigation";
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
import { ReturnAllNumbers } from "@/app/includes/functions";
import { BaseLoader } from "@/app/components/baseLoader";
import BaseSelect from "@/app/components/baseSelect";
import { ItemProps, StateLGAProp } from "@/app/includes/types";
import {CameraIcon, CheckCircle, UploadIcon } from "lucide-react";
import { ImagePickerOption } from "./components/imagePickerOption";
import { CameraView } from "./components/cameraView";
import dayjs from "dayjs";
import { ConsentPage } from "./components/consent";
import BaseModal from "@/app/components/baseModal";
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
    const [userIsAgent] = useState<boolean>(false);
    const [showOption, setShowOption] = useState<boolean>(false);
    const [userIsMinor, setUserMinor] = useState<boolean>(false);
    const [showState, setShowState] = useState<boolean>(false);
    const [showAddress, setShowAddress] = useState<boolean>(false);
    const [listOfLGA, setListOfLGA] = useState<string[]>([]);
    const [section, setSection] = useState<RegisterProps>("User Details")
    const navigate = useRouter();
    const { handleRegisterUser, ShowMessage, loading, RequestForRSAPIN, GetListOfSectors } = useHttpHook();
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

    const [avatar, setAvatar] = useState<string>("");
    useEffect(() => {
        if (section === "User Details") {
            setIndex(0)
        }
        if (section === "Verify Email") {
            setIndex(1)
        }
        if (section === "Next Of Kin") {
            setIndex(2)
        }
        if (section === "Consent Agreement") {
            setIndex(3)
        }
        if (section === "Success") {
            setIndex(4)
        }
    }, [section])

    

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
   
    const pfaList: ItemProps[] = [
        {
            title: "ACCESSARM PENSIONS",
            name: "ACCESSARM PENSIONS",
            value: "024"
        },
        {
            title:"LEADWAY PENSURE",
            name:"LEADWAY PENSURE",
            value:"023"
        }
        ,
        {
            title:"Stanbic Ibtc Pension Managers",
            name:"Stanbic Ibtc Pension Managers",
            value:"021"
        },
        {
            title:"Fidelity Pension Managers Limited",
            name:"Fidelity Pension Managers Limited",
            value:"043"
        },
        {
            title:"CrusaderSterling Pensions Limited",
            name:"CrusaderSterling Pensions Limited",
            value:"032"
        },
        {
            title:"NLPC Pension Fund Administrators Limited(NLPC PFA)",
            name:"NLPC Pension Fund Administrators Limited(NLPC PFA)",
            value:"031"
        },
        {
            title:"Trustfund Pensions Limited",
            name:"Trustfund Pensions Limited",
            value:"028"
        }
    ];
    
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
    useEffect(() => {
        ListOfSectors();
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

    const StateLGA: StateLGAProp[] = [
        {
            state: "Adamawa",
            alias: "adamawa",
            lgas: [
                "Demsa",
                "Fufure",
                "Ganye",
                "Gayuk",
                "Gombi",
                "Grie",
                "Hong",
                "Jada",
                "Larmurde",
                "Madagali",
                "Maiha",
                "Mayo Belwa",
                "Michika",
                "Mubi North",
                "Mubi South",
                "Numan",
                "Shelleng",
                "Song",
                "Toungo",
                "Yola North",
                "Yola South"
            ]
        },
        {
            state: "Akwa Ibom",
            alias: "akwa_ibom",
            lgas: [
                "Abak",
                "Eastern Obolo",
                "Eket",
                "Esit Eket",
                "Essien Udim",
                "Etim Ekpo",
                "Etinan",
                "Ibeno",
                "Ibesikpo Asutan",
                "Ibiono-Ibom",
                "Ikot Abasi",
                "Ika",
                "Ikono",
                "Ikot Ekpene",
                "Ini",
                "Mkpat-Enin",
                "Itu",
                "Mbo",
                "Nsit-Atai",
                "Nsit-Ibom",
                "Nsit-Ubium",
                "Obot Akara",
                "Okobo",
                "Onna",
                "Oron",
                "Udung-Uko",
                "Ukanafun",
                "Oruk Anam",
                "Uruan",
                "Urue-Offong/Oruko",
                "Uyo"
            ]
        },
        {
            state: "Anambra",
            alias: "anambra",
            lgas: [
                "Aguata",
                "Anambra East",
                "Anaocha",
                "Awka North",
                "Anambra West",
                "Awka South",
                "Ayamelum",
                "Dunukofia",
                "Ekwusigo",
                "Idemili North",
                "Idemili South",
                "Ihiala",
                "Njikoka",
                "Nnewi North",
                "Nnewi South",
                "Ogbaru",
                "Onitsha North",
                "Onitsha South",
                "Orumba North",
                "Orumba South",
                "Oyi"
            ]
        },
        {
            state: "Ogun",
            alias: "ogun",
            lgas: [
                "Abeokuta North",
                "Abeokuta South",
                "Ado-Odo/Ota",
                "Egbado North",
                "Ewekoro",
                "Egbado South",
                "Ijebu North",
                "Ijebu East",
                "Ifo",
                "Ijebu Ode",
                "Ijebu North East",
                "Imeko Afon",
                "Ikenne",
                "Ipokia",
                "Odeda",
                "Obafemi Owode",
                "Odogbolu",
                "Remo North",
                "Ogun Waterside",
                "Shagamu"
            ]
        },
        {
            state: "Ondo",
            alias: "ondo",
            lgas: [
                "Akoko North-East",
                "Akoko North-West",
                "Akoko South-West",
                "Akoko South-East",
                "Akure North",
                "Akure South",
                "Ese Odo",
                "Idanre",
                "Ifedore",
                "Ilaje",
                "Irele",
                "Ile Oluji/Okeigbo",
                "Odigbo",
                "Okitipupa",
                "Ondo West",
                "Ose",
                "Ondo East",
                "Owo"
            ]
        },
        {
            state: "Rivers",
            alias: "rivers",
            lgas: [
                "Abua/Odual",
                "Ahoada East",
                "Ahoada West",
                "Andoni",
                "Akuku-Toru",
                "Asari-Toru",
                "Bonny",
                "Degema",
                "Emuoha",
                "Eleme",
                "Ikwerre",
                "Etche",
                "Gokana",
                "Khana",
                "Obio/Akpor",
                "Ogba/Egbema/Ndoni",
                "Ogu/Bolo",
                "Okrika",
                "Omuma",
                "Opobo/Nkoro",
                "Oyigbo",
                "Port Harcourt",
                "Tai"
            ]
        },
        {
            state: "Bauchi",
            alias: "bauchi",
            lgas: [
                "Alkaleri",
                "Bauchi",
                "Bogoro",
                "Damban",
                "Darazo",
                "Dass",
                "Gamawa",
                "Ganjuwa",
                "Giade",
                "Itas/Gadau",
                "Jama'are",
                "Katagum",
                "Kirfi",
                "Misau",
                "Ningi",
                "Shira",
                "Tafawa Balewa",
                "Toro",
                "Warji",
                "Zaki"
            ]
        },
        {
            state: "Benue",
            alias: "benue",
            lgas: [
                "Agatu",
                "Apa",
                "Ado",
                "Buruku",
                "Gboko",
                "Guma",
                "Gwer East",
                "Gwer West",
                "Katsina-Ala",
                "Konshisha",
                "Kwande",
                "Logo",
                "Makurdi",
                "Obi",
                "Ogbadibo",
                "Ohimini",
                "Oju",
                "Okpokwu",
                "Oturkpo",
                "Tarka",
                "Ukum",
                "Ushongo",
                "Vandeikya"
            ]
        },
        {
            state: "Borno",
            alias: "borno",
            lgas: [
                "Abadam",
                "Askira/Uba",
                "Bama",
                "Bayo",
                "Biu",
                "Chibok",
                "Damboa",
                "Dikwa",
                "Guzamala",
                "Gubio",
                "Hawul",
                "Gwoza",
                "Jere",
                "Kaga",
                "Kala/Balge",
                "Konduga",
                "Kukawa",
                "Kwaya Kusar",
                "Mafa",
                "Magumeri",
                "Maiduguri",
                "Mobbar",
                "Marte",
                "Monguno",
                "Ngala",
                "Nganzai",
                "Shani"
            ]
        },
        {
            state: "Bayelsa",
            alias: "bayelsa",
            lgas: [
                "Brass",
                "Ekeremor",
                "Kolokuma/Opokuma",
                "Nembe",
                "Ogbia",
                "Sagbama",
                "Southern Ijaw",
                "Yenagoa"
            ]
        },
        {
            state: "Cross River",
            alias: "cross_river",
            lgas: [
                "Abi",
                "Akamkpa",
                "Akpabuyo",
                "Bakassi",
                "Bekwarra",
                "Biase",
                "Boki",
                "Calabar Municipal",
                "Calabar South",
                "Etung",
                "Ikom",
                "Obanliku",
                "Obubra",
                "Obudu",
                "Odukpani",
                "Ogoja",
                "Yakuur",
                "Yala"
            ]
        },
        {
            state: "Delta",
            alias: "delta",
            lgas: [
                "Aniocha North",
                "Aniocha South",
                "Bomadi",
                "Burutu",
                "Ethiope West",
                "Ethiope East",
                "Ika North East",
                "Ika South",
                "Isoko North",
                "Isoko South",
                "Ndokwa East",
                "Ndokwa West",
                "Okpe",
                "Oshimili North",
                "Oshimili South",
                "Patani",
                "Sapele",
                "Udu",
                "Ughelli North",
                "Ukwuani",
                "Ughelli South",
                "Uvwie",
                "Warri North",
                "Warri South",
                "Warri South West"
            ]
        },
        {
            state: "Ebonyi",
            alias: "ebonyi",
            lgas: [
                "Abakaliki",
                "Afikpo North",
                "Ebonyi",
                "Afikpo South",
                "Ezza North",
                "Ikwo",
                "Ezza South",
                "Ivo",
                "Ishielu",
                "Izzi",
                "Ohaozara",
                "Ohaukwu",
                "Onicha"
            ]
        },
        {
            state: "Edo",
            alias: "edo",
            lgas: [
                "Akoko-Edo",
                "Egor",
                "Esan Central",
                "Esan North-East",
                "Esan South-East",
                "Esan West",
                "Etsako Central",
                "Etsako East",
                "Etsako West",
                "Igueben",
                "Ikpoba Okha",
                "Orhionmwon",
                "Oredo",
                "Ovia North-East",
                "Ovia South-West",
                "Owan East",
                "Owan West",
                "Uhunmwonde"
            ]
        },
        {
            state: "Ekiti",
            alias: "ekiti",
            lgas: [
                "Ado Ekiti",
                "Efon",
                "Ekiti East",
                "Ekiti South-West",
                "Ekiti West",
                "Emure",
                "Gbonyin",
                "Ido Osi",
                "Ijero",
                "Ikere",
                "Ilejemeje",
                "Irepodun/Ifelodun",
                "Ikole",
                "Ise/Orun",
                "Moba",
                "Oye"
            ]
        },
        {
            state: "Enugu",
            alias: "enugu",
            lgas: [
                "Awgu",
                "Aninri",
                "Enugu East",
                "Enugu North",
                "Ezeagu",
                "Enugu South",
                "Igbo Etiti",
                "Igbo Eze North",
                "Igbo Eze South",
                "Isi Uzo",
                "Nkanu East",
                "Nkanu West",
                "Nsukka",
                "Udenu",
                "Oji River",
                "Uzo Uwani",
                "Udi"
            ]
        },
        {
            state: "Federal Capital Territory",
            alias: "abuja",
            lgas: [
                "Abaji",
                "Bwari",
                "Gwagwalada",
                "Kuje",
                "Kwali",
                "Municipal Area Council"
            ]
        },
        {
            state: "Gombe",
            alias: "gombe",
            lgas: [
                "Akko",
                "Balanga",
                "Billiri",
                "Dukku",
                "Funakaye",
                "Gombe",
                "Kaltungo",
                "Kwami",
                "Nafada",
                "Shongom",
                "Yamaltu/Deba"
            ]
        },
        {
            state: "Jigawa",
            alias: "jigawa",
            lgas: [
                "Auyo",
                "Babura",
                "Buji",
                "Biriniwa",
                "Birnin Kudu",
                "Dutse",
                "Gagarawa",
                "Garki",
                "Gumel",
                "Guri",
                "Gwaram",
                "Gwiwa",
                "Hadejia",
                "Jahun",
                "Kafin Hausa",
                "Kazaure",
                "Kiri Kasama",
                "Kiyawa",
                "Kaugama",
                "Maigatari",
                "Malam Madori",
                "Miga",
                "Sule Tankarkar",
                "Roni",
                "Ringim",
                "Yankwashi",
                "Taura"
            ]
        },
        {
            state: "Oyo",
            alias: "oyo",
            lgas: [
                "Afijio",
                "Akinyele",
                "Atiba",
                "Atisbo",
                "Egbeda",
                "Ibadan North",
                "Ibadan North-East",
                "Ibadan North-West",
                "Ibadan South-East",
                "Ibarapa Central",
                "Ibadan South-West",
                "Ibarapa East",
                "Ido",
                "Ibarapa North",
                "Irepo",
                "Iseyin",
                "Itesiwaju",
                "Iwajowa",
                "Kajola",
                "Lagelu",
                "Ogbomosho North",
                "Ogbomosho South",
                "Ogo Oluwa",
                "Olorunsogo",
                "Oluyole",
                "Ona Ara",
                "Orelope",
                "Ori Ire",
                "Oyo",
                "Oyo East",
                "Saki East",
                "Saki West",
                "Surulere Oyo State"
            ]
        },
        {
            state: "Imo",
            alias: "imo",
            lgas: [
                "Aboh Mbaise",
                "Ahiazu Mbaise",
                "Ehime Mbano",
                "Ezinihitte",
                "Ideato North",
                "Ideato South",
                "Ihitte/Uboma",
                "Ikeduru",
                "Isiala Mbano",
                "Mbaitoli",
                "Isu",
                "Ngor Okpala",
                "Njaba",
                "Nkwerre",
                "Nwangele",
                "Obowo",
                "Oguta",
                "Ohaji/Egbema",
                "Okigwe",
                "Orlu",
                "Orsu",
                "Oru East",
                "Oru West",
                "Owerri Municipal",
                "Owerri North",
                "Unuimo",
                "Owerri West"
            ]
        },
        {
            state: "Kaduna",
            alias: "kaduna",
            lgas: [
                "Birnin Gwari",
                "Chikun",
                "Giwa",
                "Ikara",
                "Igabi",
                "Jaba",
                "Jema'a",
                "Kachia",
                "Kaduna North",
                "Kaduna South",
                "Kagarko",
                "Kajuru",
                "Kaura",
                "Kauru",
                "Kubau",
                "Kudan",
                "Lere",
                "Makarfi",
                "Sabon Gari",
                "Sanga",
                "Soba",
                "Zangon Kataf",
                "Zaria"
            ]
        },
        {
            state: "Kebbi",
            alias: "kebbi",
            lgas: [
                "Aleiro",
                "Argungu",
                "Arewa Dandi",
                "Augie",
                "Bagudo",
                "Birnin Kebbi",
                "Bunza",
                "Dandi",
                "Fakai",
                "Gwandu",
                "Jega",
                "Kalgo",
                "Koko/Besse",
                "Maiyama",
                "Ngaski",
                "Shanga",
                "Suru",
                "Sakaba",
                "Wasagu/Danko",
                "Yauri",
                "Zuru"
            ]
        },
        {
            state: "Kano",
            alias: "kano",
            lgas: [
                "Ajingi",
                "Albasu",
                "Bagwai",
                "Bebeji",
                "Bichi",
                "Bunkure",
                "Dala",
                "Dambatta",
                "Dawakin Kudu",
                "Dawakin Tofa",
                "Doguwa",
                "Fagge",
                "Gabasawa",
                "Garko",
                "Garun Mallam",
                "Gezawa",
                "Gaya",
                "Gwale",
                "Gwarzo",
                "Kabo",
                "Kano Municipal",
                "Karaye",
                "Kibiya",
                "Kiru",
                "Kumbotso",
                "Kunchi",
                "Kura",
                "Madobi",
                "Makoda",
                "Minjibir",
                "Nasarawa",
                "Rano",
                "Rimin Gado",
                "Rogo",
                "Shanono",
                "Takai",
                "Sumaila",
                "Tarauni",
                "Tofa",
                "Tsanyawa",
                "Tudun Wada",
                "Ungogo",
                "Warawa",
                "Wudil"
            ]
        },
        {
            state: "Kogi",
            alias: "kogi",
            lgas: [
                "Ajaokuta",
                "Adavi",
                "Ankpa",
                "Bassa",
                "Dekina",
                "Ibaji",
                "Idah",
                "Igalamela Odolu",
                "Ijumu",
                "Kogi",
                "Kabba/Bunu",
                "Lokoja",
                "Ofu",
                "Mopa Muro",
                "Ogori/Magongo",
                "Okehi",
                "Okene",
                "Olamaboro",
                "Omala",
                "Yagba East",
                "Yagba West"
            ]
        },
        {
            state: "Osun",
            alias: "osun",
            lgas: [
                "Aiyedire",
                "Atakunmosa West",
                "Atakunmosa East",
                "Aiyedaade",
                "Boluwaduro",
                "Boripe",
                "Ife East",
                "Ede South",
                "Ife North",
                "Ede North",
                "Ife South",
                "Ejigbo",
                "Ife Central",
                "Ifedayo",
                "Egbedore",
                "Ila",
                "Ifelodun",
                "Ilesa East",
                "Ilesa West",
                "Irepodun",
                "Irewole",
                "Isokan",
                "Iwo",
                "Obokun",
                "Odo Otin",
                "Ola Oluwa",
                "Olorunda",
                "Oriade",
                "Orolu",
                "Osogbo"
            ]
        },
        {
            state: "Sokoto",
            alias: "sokoto",
            lgas: [
                "Gudu",
                "Gwadabawa",
                "Illela",
                "Isa",
                "Kebbe",
                "Kware",
                "Rabah",
                "Sabon Birni",
                "Shagari",
                "Silame",
                "Sokoto North",
                "Sokoto South",
                "Tambuwal",
                "Tangaza",
                "Tureta",
                "Wamako",
                "Wurno",
                "Yabo",
                "Binji",
                "Bodinga",
                "Dange Shuni",
                "Goronyo",
                "Gada"
            ]
        },
        {
            state: "Plateau",
            alias: "plateau",
            lgas: [
                "Bokkos",
                "Barkin Ladi",
                "Bassa",
                "Jos East",
                "Jos North",
                "Jos South",
                "Kanam",
                "Kanke",
                "Langtang South",
                "Langtang North",
                "Mangu",
                "Mikang",
                "Pankshin",
                "Qua'an Pan",
                "Riyom",
                "Shendam",
                "Wase"
            ]
        },
        {
            state: "Taraba",
            alias: "taraba",
            lgas: [
                "Ardo Kola",
                "Bali",
                "Donga",
                "Gashaka",
                "Gassol",
                "Ibi",
                "Jalingo",
                "Karim Lamido",
                "Kumi",
                "Lau",
                "Sardauna",
                "Takum",
                "Ussa",
                "Wukari",
                "Yorro",
                "Zing"
            ]
        },
        {
            state: "Yobe",
            alias: "yobe",
            lgas: [
                "Bade",
                "Bursari",
                "Damaturu",
                "Fika",
                "Fune",
                "Geidam",
                "Gujba",
                "Gulani",
                "Jakusko",
                "Karasuwa",
                "Machina",
                "Nangere",
                "Nguru",
                "Potiskum",
                "Tarmuwa",
                "Yunusari",
                "Yusufari"
            ]
        },
        {
            state: "Zamfara",
            alias: "zamfara",
            lgas: [
                "Anka",
                "Birnin Magaji/Kiyaw",
                "Bakura",
                "Bukkuyum",
                "Bungudu",
                "Gummi",
                "Gusau",
                "Kaura Namoda",
                "Maradun",
                "Shinkafi",
                "Maru",
                "Talata Mafara",
                "Tsafe",
                "Zurmi"
            ]
        },
        {
            state: "Lagos",
            alias: "lagos",
            lgas: [
                "Agege",
                "Ajeromi-Ifelodun",
                "Alimosho",
                "Amuwo-Odofin",
                "Badagry",
                "Apapa",
                "Epe",
                "Eti Osa",
                "Ibeju-Lekki",
                "Ifako-Ijaiye",
                "Ikeja",
                "Ikorodu",
                "Kosofe",
                "Lagos Island",
                "Mushin",
                "Lagos Mainland",
                "Ojo",
                "Oshodi-Isolo",
                "Shomolu",
                "Surulere Lagos State"
            ]
        },
        {
            state: "Katsina",
            alias: "katsina",
            lgas: [
                "Bakori",
                "Batagarawa",
                "Batsari",
                "Baure",
                "Bindawa",
                "Charanchi",
                "Danja",
                "Dandume",
                "Dan Musa",
                "Daura",
                "Dutsi",
                "Dutsin Ma",
                "Faskari",
                "Funtua",
                "Ingawa",
                "Jibia",
                "Kafur",
                "Kaita",
                "Kankara",
                "Kankia",
                "Katsina",
                "Kurfi",
                "Kusada",
                "Mai'Adua",
                "Malumfashi",
                "Mani",
                "Mashi",
                "Matazu",
                "Musawa",
                "Rimi",
                "Sabuwa",
                "Safana",
                "Sandamu",
                "Zango"
            ]
        },
        {
            state: "Kwara",
            alias: "kwara",
            lgas: [
                "Asa",
                "Baruten",
                "Edu",
                "Ilorin East",
                "Ifelodun",
                "Ilorin South",
                "Ekiti Kwara State",
                "Ilorin West",
                "Irepodun",
                "Isin",
                "Kaiama",
                "Moro",
                "Offa",
                "Oke Ero",
                "Oyun",
                "Pategi"
            ]
        },
        {
            state: "Nasarawa",
            alias: "nasarawa",
            lgas: [
                "Akwanga",
                "Awe",
                "Doma",
                "Karu",
                "Keana",
                "Keffi",
                "Lafia",
                "Kokona",
                "Nasarawa Egon",
                "Nasarawa",
                "Obi",
                "Toto",
                "Wamba"
            ]
        },
        {
            state: "Niger",
            alias: "niger",
            lgas: [
                "Agaie",
                "Agwara",
                "Bida",
                "Borgu",
                "Bosso",
                "Chanchaga",
                "Edati",
                "Gbako",
                "Gurara",
                "Katcha",
                "Kontagora",
                "Lapai",
                "Lavun",
                "Mariga",
                "Magama",
                "Mokwa",
                "Mashegu",
                "Moya",
                "Paikoro",
                "Rafi",
                "Rijau",
                "Shiroro",
                "Suleja",
                "Tafa",
                "Wushishi"
            ]
        },
        {
            state: "Abia",
            alias: "abia",
            lgas: [
                "Aba North",
                "Arochukwu",
                "Aba South",
                "Bende",
                "Isiala Ngwa North",
                "Ikwuano",
                "Isiala Ngwa South",
                "Isuikwuato",
                "Obi Ngwa",
                "Ohafia",
                "Osisioma",
                "Ugwunagbo",
                "Ukwa East",
                "Ukwa West",
                "Umuahia North",
                "Umuahia South",
                "Umu Nneochi"
            ]
        }
    ];

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
        if (StateLGA.length !== 0) {
            const list = StateLGA[0];
            if (list.alias.length !== 0) {
                setListOfLGA(list.lgas)
            }
            setFormData({
                ...formData,
                state: list.state
            })
        }
    }, [])

    return <div className="bg-white h-full lg:px-[100px] lg:py-[60px] overflow-none p-[16px]">
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
                        {!formData.hasBVN && <BaseInput
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
                        />}
                         
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
                                <CameraIcon className="absolute bottom-[-10px] right-[-10px] text-black"
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
                                        list={StateLGA.map((a: StateLGAProp, i: number) => {
                                            return {
                                                name: a.state,
                                                title: a.state,
                                                value: a.state
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
                                            const foundItem = StateLGA.find((a, i) => a.state === value);
                                            if (foundItem) {
                                                setListOfLGA(foundItem.lgas)
                                            }
                                        }}
                                        value={formData.state!}
                                        custom
                                    />
                                </div>
                                <div className="text-left mb-4" >
                                    <BaseSelect
                                        label="LGA"
                                        list={listOfLGA.map((a:any, i:number) => {
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
                        {!formData.hasBVN && !userIsMinor &&<BaseInput
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
                        />}
                       
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
                            setSection("Success")
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