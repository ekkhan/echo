import { ConversationIdLayout } from "@/modules/dashboard/ui/layouts/conversation-id-layout";
// import { ConversationsLayout } from "@/modules/dashboard/ui/layouts/conversations-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ConversationIdLayout>
            {children}
        </ConversationIdLayout>
    )
}

export default Layout;