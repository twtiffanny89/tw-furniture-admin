import { UserRoleEnum } from "@/constants/enum/UserRoleEnum";
import React, { ComponentType } from "react";
import AuthWrapper from "./wapper";

const authWrapper = <P extends object>(
  Component: ComponentType<P>,
  requiredRoles: UserRoleEnum[]
) => {
  // Now, withAuthWrapper properly types the Component and includes the required roles and children
  const Wrapper: React.FC<P> = (props: P) => {
    return (
      <AuthWrapper requiredRoles={requiredRoles}>
        <Component {...props} />
      </AuthWrapper>
    );
  };

  return Wrapper;
};

export default authWrapper;
