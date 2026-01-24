import BaseModal from "@/app/components/baseModal"
import { UserDetails } from "../../page"
import { BaseLoader } from "@/app/components/baseLoader"
import { useRouter } from "next/navigation"
import { UserIcon } from "../page"
import useHttpHook from "@/app/includes/useHttpHook"

export const SaveProfileModal = ({ onClose, details }: { onClose: () => void; details: UserDetails }) => {
    const {saveProfileDetails,loading} = useHttpHook()
    const navigate = useRouter()
    const handleUpdate = () => {
        let firstName = "";
        let lastName = "";
        const SplitName = String(details.fullName).split(" ");
        if(SplitName.length !== 1)
        {
         firstName = SplitName[0];
         lastName = SplitName[1];
        }
        saveProfileDetails({
            ...details,
            firstName,
            lastName
        }).then((res)=>{
            if(res.status)
            {
                onClose()
            }
        })
    }

    return <BaseModal
        title=""
        onClose={onClose}
    >
        <div>
            <div className="py-4 flex justify-center">
                <div className="bg-indigo-100 p-4 rounded-full">
                    <UserIcon />
                </div>
            </div>

            <div className="modal-body px-10 py-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2" id="saveProfileModalLabel">Update Profile?</h3>
                <p className="text-gray-500 leading-relaxed">
                    Are you sure you want to save these changes to your profile? This will update your public information across the platform.
                </p>
            </div>

            <div className="modal-footer border-0 px-10 pb-8 flex justify-center gap-3">
                <button
                    onClick={onClose}
                    type="button" className="flex-1 cursor-pointer text-[#009668] item-center border-[0.5px] border-[#009668] py-3 px-4 rounded-[12px] font-medium bg-gray-100 hover:bg-gray-200 transition-colors" >
                    No, Cancel
                </button>
                <button
                    onClick={handleUpdate}
                    className="flex-1 flex cursor-pointer item-center gap-1 justify-center py-3 px-4 rounded-[12px] font-medium text-white bg-[#009668] hover:bg-[#009668] text-center no-underline transition-colors shadow-md">
                    {loading && <BaseLoader color="white" size="md" />}
                    <span>Yes, Save Now</span>
                </button>
            </div>
        </div>
    </BaseModal>
}