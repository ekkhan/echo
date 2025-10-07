//layout will wrap around both sign in and sign up routes

import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";

const Layout = ( { children } : { children: React.ReactNode }) => {
    return (
        <AuthLayout>
            {children}
        </AuthLayout>
    );
};

export default Layout;