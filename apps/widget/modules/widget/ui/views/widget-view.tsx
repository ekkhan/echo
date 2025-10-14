"use client";

import { useAtomValue } from "jotai";
import { WidgetAuthScreen } from "../screens/widget-auth-screen";
import { screenAtom } from "../../atoms/widget-atoms";

interface Props {
    organizationId: string;
}

export const WidgetView = ({organizationId}:Props) => {
    const screen = useAtomValue(screenAtom);

    const screenComponents = {
        loading: <p>TODO: loading</p>,
        error: <p>TODO: error</p>,
        auth: <WidgetAuthScreen />,
        voice: <p>TODO: voice</p>,
        inbox: <p>TODO: inbox</p>,
        selection: <p>TODO: selection</p>,
        chat: <p>TODO: chat</p>,
        contact: <p>TODO: contact</p>,
      }
    

    return (<main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
        {screenComponents[screen]}
        </main>
    );
};