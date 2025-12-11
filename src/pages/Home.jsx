import Login from "@/components/auth/Login";
import TermsAndConditions from '../components/welcome/TermsAndConditions';

export default function LoginForm() {
  const accepted = localStorage.getItem("accepted") === "true";
  return accepted ? <Login /> : <TermsAndConditions />;
}
