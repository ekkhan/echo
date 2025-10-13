"use client";

import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

interface Props {
    organizationId: string;
}

export const WidgetView = ({organizationId}:Props) => {
    return (<main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
        
        <WidgetHeader>
            <div>
                <p className="text-3xl">
                    Hi there! 👋
                </p>
                <p className="text-lg">
                    How can we help you today?
                </p>
            </div>
        </WidgetHeader>
       <div className="flex flex-1"> 
        Widget view: {organizationId}
         </div>
        <WidgetFooter/>
        </main>
    );
};