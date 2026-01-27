/* eslint-disable @typescript-eslint/no-explicit-any */
import {create} from 'zustand';

interface CommissionParamProp {
  showCommissionBalance:boolean;
  update:(state:CommissionProp)=>void;
  }
interface CommissionProp {
  showCommissionBalance:boolean;
  }
 
const useCommissionStore = create<CommissionParamProp>((set) => ({
  showCommissionBalance: false,
  update: (state:CommissionProp) =>{
    set(state)
  }
}))

export default useCommissionStore;