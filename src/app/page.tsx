import { routed } from "@/constants/navigation/routed";
import { redirect } from "next/navigation";

const page = () => {
  redirect(`/${routed.userManagement}/${routed.dashboard}`);
};

export default page;
