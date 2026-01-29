import BaseButton from "@/app/components/baseButton";
import BaseInput from "@/app/components/baseInput";
import BaseModal from "@/app/components/baseModal";
import useHttpHook from "@/app/includes/useHttpHook";
import { FormEvent, useState } from "react"

export const HandleResetData = ()=>{
    const {loading,ResetTestData} = useHttpHook();
    const [show,setShow] = useState<boolean>(false);
    const [formData,setFormData] = useState<string>("")
    const handleSubmit = (e:FormEvent)=>{
        e.preventDefault();
        ResetTestData(formData).then((res)=>{
            if(res.status)
            {
            setShow(false)
            }
        })
    }
    return <div >
        <button 
              onClick={()=>setShow(true)}
              className="p-3 text-black mt-5 cursor-pointer"
              >
                Reset Test Data
              </button>
              {show && <BaseModal 
              title="Reset test data"
              onClose={()=>setShow(false)}
              >
              <div >
                <form onSubmit={handleSubmit}>
                        <BaseInput 
                        type="text"
                        name="email"
                        value={formData}
                        required
                        onValueChange={({value})=>{
                            setFormData(String(value).trim().toLowerCase())
                        }}
                        label="Email"
                        placeholder="Enter Email."
                        className="mb-5"
                        />
                        <BaseButton
                        loading={loading}
                        text="Reset Now"
                        type="submit"
                        />
                 </form>
              </div>
              </BaseModal>}
    </div>
}