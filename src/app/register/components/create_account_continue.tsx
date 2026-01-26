import BaseInput from "@/app/components/baseInput"
import { useState } from "react"
import { SignUpProps } from "../page"
import BaseButton from "@/app/components/baseButton"
import useHttpHook from "@/app/includes/useHttpHook"
import BaseSelect from "@/app/components/baseSelect"

export const CreatAccounContinue = () => {
    const { loading } = useHttpHook();
    const handleSubmit = () => {

    }
    const [formData, setFormData] = useState<SignUpProps>({
        howDoYouFindUs: "",
        state: "",
        address:""
    })

    return <form onSubmit={handleSubmit}>
        <div className="text-[#909090] text-[12px] text-left">Fill in your details to register as an Awabah Agent.</div>
        <BaseSelect
            list={[]}
            name="howDoYouFindUs"
            value={formData.howDoYouFindUs!}
            required
            onValueChange={({ value }) => {
                setFormData({
                    ...formData,
                    howDoYouFindUs: value
                })
            }}
            label="How did you hear about us?"
            placeholder="Select"
        />
        <BaseSelect
            list={[]}
            name="state"
            value={formData.state!}
            required
            onValueChange={({ value }) => {
                setFormData({
                    ...formData,
                    state: value
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
                    email: value
                })
            }}
            max={140}
            label="Your home address"
            placeholder="Enter Your home address."
        />
        <BaseButton
            loading={loading}
            text="Create Account"
            type="submit"
        />
    </form>
}
