import { useSelector } from "react-redux";
import { RootState } from "../state/store";

export const useSecrets = () => {
    const {secrets } = useSelector((state: RootState) => state.globalVariables);

    return {
        secrets
    };
}