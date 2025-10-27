"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { LoaderIcon } from "lucide-react";
import { contactSessionIdAtomFamily, errorMessageAtom, loadingMessageAtom, organizationIdAtom, screenAtom, vapiSecretsAtom, widgetSettingsAtom } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { useEffect, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type InitStep = "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({organizationId}: {organizationId: string | null}) => {
    const [step, setStep] = useState<InitStep>("org")
    const [sessionValid, setSessionValid] = useState(false);
    const loadingMessage=useAtomValue(loadingMessageAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setScreen = useSetAtom(screenAtom);
    const setOrganizationId = useSetAtom(organizationIdAtom);
    const setLoadingMessage = useSetAtom(loadingMessageAtom);
    const setVapiSecrets = useSetAtom(vapiSecretsAtom);
    const setWidgetSettings = useSetAtom(widgetSettingsAtom);

    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));

    // Step 1: validate organization
    const validateOrganization = useAction(api.public.organizations.validate)
    useEffect(()=>{
        if(step!="org"){
            return;
        }

        setLoadingMessage("Finding organization ID...")

        if (!organizationId) {
            setErrorMessage("organization ID is required");
            setScreen("error");
            return;
        }

        
        setLoadingMessage("Verifying organization...");

        validateOrganization({ organizationId })
        .then((result) => {
            if (result.valid) {
                setOrganizationId(organizationId);
                setStep("session");
            } else {
                setErrorMessage(result.reason || "Invalid configuration");
                setScreen("error");
            }
        })
        .catch(() => {
            setErrorMessage("Unable to verify organization");
            setScreen("error");
        })

    }, [step, organizationId, setErrorMessage, setScreen, setOrganizationId, setStep, validateOrganization, setLoadingMessage])

    // Step 2: validate session (if exists)
    const validateContactSession = useMutation(api.public.contactSessions.validate)
    useEffect(() => {
        if (step !== "session") {
            return;
        }

        setLoadingMessage("Finding contact session ID...");

        if (!contactSessionId) {
            setSessionValid(false);
            setStep("settings")
            return;
        }

        setLoadingMessage("Validating session...");

        validateContactSession({
            contactSessionId
        }).then((result) => {
            setSessionValid(result.valid);
            setStep("settings");
        }).catch(() => {
            setSessionValid(false);
            setStep("settings");
        });

    }, [step, contactSessionId, validateContactSession, setLoadingMessage, setStep]);

    // step 3: load widget settings
    const widgetSettings = useQuery(api.public.widgetSettings.getByOrganizationId,
        organizationId ? {
            organizationId,
        } : "skip",
    )

    useEffect(()=>{
        if(step !== "settings"){
            return;
        }
        setLoadingMessage("Loading widget settings...");
        if(widgetSettings!==undefined){
            setWidgetSettings(widgetSettings);
            setStep("vapi");
        }
    }, [step, widgetSettings, setWidgetSettings, setLoadingMessage, setStep]);

    // Step 4: Load VAPI secrets
    const getVapiSecrets = useAction(api.public.secrets.getVapiSecrets)
    useEffect(() => {
        if (step !== "vapi") {
            return;
        }

        if (!organizationId) {
            setErrorMessage("organization ID is required");
            setScreen("error");
            return;
        }

        setLoadingMessage("Loading vapi settings...");
        getVapiSecrets({organizationId})
            .then((secrets) => {
                setVapiSecrets(secrets);
                setStep("done")
            })
            .catch(() => {
                setVapiSecrets(null)
                setStep("done")
            })

        

    }, [step, organizationId, getVapiSecrets, setVapiSecrets, setLoadingMessage, setStep]);

    useEffect(() => {
        if (step !== "done") {
            return;
        }

        const hasValidSession = contactSessionId && sessionValid;

        setScreen(hasValidSession ? "selection" : "auth");

    }, [step, contactSessionId, sessionValid, setScreen]);

    return (
        <>
        <WidgetHeader>
        <div className="font-semibold flex flex-col justify-between gap-y-2 px-2 py-6">
          <p className="text-3xl">Hi there! 👋</p>
          <p className="text-lg">let&apos;s get you started</p>
        </div>
        </WidgetHeader>
        <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
            <LoaderIcon className="animate-spin" />
            <p className="text-sm">
                {loadingMessage || "Loading..."}
            </p>
        </div>
        </>
    );
}