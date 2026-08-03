import {create} from 'zustand';
interface UserDetailsProp {
  firstName?: string;
  lastName?: string;
  accountNumber?: string;
  agentId?: string;
  id?: string;
  email?: string;
  phoneNumber?: string;
  createdAt?: string;
  activated?: string;
  accountType?: "SuperAgent" | "Agent";
  rsaNumber?: string;
  sex?: string;
  dob?: string;
  maritalStatus?: string;
  maidenName?: null;
  placeOfBirth?: null;
  nationality?: string;
  stateOfOrigin?: string;
  lGAOfOrigin?: string;
  fatherFirstName?: null;
  fatherLastName?: null;
  address?: string;
  villageTownCity?: null;
  zipCode?: null;
  state?:string;
  countryResidenceCode?: null;
  pobox?: null;
  stateCode?: null;
  cityCode?: null;
  lga?: string;
  pensionProviderName?: string;
  pensionProviderCode?: string;
  isAgent?: boolean;
  nextOfKinRegistered?: boolean;
  employerDetailsRegistered?: boolean;
  avatar?: string;
  fullName?:string;
  isAgentAsignedToSuperAgent?: string | null;
}
interface CommissionParamProp {
  showCommissionBalance:boolean;
  userDetails:UserDetailsProp;
  update:(state:CommissionProp)=>void;
  }
interface CommissionProp {
  showCommissionBalance?:boolean;
  userDetails?:UserDetailsProp;
  }
 
const useCommissionStore = create<CommissionParamProp>((set) => ({
  showCommissionBalance: false,
  userDetails: {
    firstName: "",
    lastName: "",
    agentId: "",
    phoneNumber: "",
    createdAt: "",
    activated: "",
    accountType: "Agent",
    rsaNumber: "",
  },
  update: (state:CommissionProp) =>{
    set(state)
  }
}))

export default useCommissionStore;
