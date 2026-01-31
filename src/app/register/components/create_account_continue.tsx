import BaseInput from "@/app/components/baseInput"
import { FormEvent, useState } from "react"
import { SignUpProps } from "../page"
import BaseButton from "@/app/components/baseButton"
import useHttpHook from "@/app/includes/useHttpHook"
import BaseSelect from "@/app/components/baseSelect"
import { ItemProps } from "@/app/includes/types"
import { BaseLoader } from "@/app/components/baseLoader"

export const CreatAccounContinue = ({onSuccess,signUpform}:{onSuccess:(agentId:string)=>void;signUpform:SignUpProps}) => {
    const { loading,handleOtherDetails } = useHttpHook();
   
    const [formData, setFormData] = useState<SignUpProps>({
        howDoYouFindUs: "",
        state: "",
        address: ""
    })
 const handleSubmit = (e:FormEvent) => {
    e.preventDefault()
    handleOtherDetails({
    ...signUpform,
    ...formData
    }).then((res)=>{
        if(res.status)
        {
        onSuccess(res.data)
        }
    })
    }
    return <form onSubmit={handleSubmit}>
        <div className="text-[#909090] text-[12px] text-left">Fill in your details to register as an Awabah Agent.</div>
        <BaseSelect
            custom
            list={[
                { title: "Search Engine (Google, Bing)", value: "Search Engine (Google, Bing)", name: "Search Engine (Google, Bing)" },
                { title: "Social Media (LinkedIn, Instagram, etc.)", value: "Social Media (LinkedIn, Instagram, etc.)", name: "Social Media (LinkedIn, Instagram, etc.)" },
                { title: "Newspaper or Magazine", value: "Newspaper or Magazine", name: "Newspaper or Magazine" },
                { title: "Television / Radio", value: "Television / Radio", name: "Television / Radio" },
                { title: "Friend or Family", value: "Friend or Family", name: "Friend or Family" },
                { title: "Others", value: "Others", name: "Others" }
            ]}
            className="text-left"
            name="howDoYouFindUs"
            value={formData.howDoYouFindUs!}
            required
            onValueChange={({ title }) => {
                setFormData({
                    ...formData,
                    howDoYouFindUs: title
                })
            }}
            label="How did you hear about us?"
            placeholder="Select"
        />
        <BaseSelect
            custom
            list={[
                "Abia",
                "Adamawa",
                "Akwa Ibom",
                "Anambra",
                "Bauchi",
                "Bayelsa",
                "Benue",
                "Borno",
                "Cross River",
                "Delta",
                "Ebonyi",
                "Edo",
                "Ekiti",
                "Enugu",
                "FCT - Abuja",
                "Gombe",
                "Imo",
                "Jigawa",
                "Kaduna",
                "Kano",
                "Katsina",
                "Kebbi",
                "Kogi",
                "Kwara",
                "Lagos",
                "Nasarawa",
                "Niger",
                "Ogun",
                "Ondo",
                "Osun",
                "Oyo",
                "Plateau",
                "Rivers",
                "Sokoto",
                "Taraba",
                "Yobe",
                "Zamfara"
            ].map((state) => {
                return {
                    title: state,
                    description: state
                }
            }) as unknown as ItemProps[]}
            className="text-left"
            name="state"
            value={formData.state!}
            required
            onValueChange={({ title} ) => {
                setFormData({
                    ...formData,
                    state: title
                })
            }}
            label="State of Residence"
            placeholder="Select"
        />
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
            max={140}
            className="mb-5"
            label="Your home address"
            placeholder="Enter Your home address."
        />
        <BaseButton
            loading={loading}
            text="Create Account"
            type="submit"
        />
        {loading && <BaseLoader modal color="green" size="lg" text="" />}
    </form>
}
