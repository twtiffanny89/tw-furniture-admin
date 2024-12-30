import { routed } from "@/constants/navigation/routed";
import { redirect } from "next/navigation";

const page = () => {
  redirect(`/${routed.userManagement}/${routed.allUser}`);
};

export default page;
