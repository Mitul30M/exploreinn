"use client";
import {
  getCookie,
  getCookies,
  setCookie,
  deleteCookie,
  hasCookie,
} from "cookies-next/client";
import { Button } from "@/components/ui/button";
import {
  CircleArrowLeft,
  CircleArrowRight,
  DoorOpen,
  SaveIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import React, { useEffect, useRef } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useAppStore,
} from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  loadRegisterListingSlice,
  nextStep,
  prevStep,
} from "@/lib/redux-store/slices/register-listing-slice";
import RenderStep1 from "@/components/listing-page/register-listing-page/multi-stepper-form/step1-render";
import RenderStep2 from "@/components/listing-page/register-listing-page/multi-stepper-form/step2-render";
import RenderStep3 from "@/components/listing-page/register-listing-page/multi-stepper-form/step3-render";
import RenderStep4 from "@/components/listing-page/register-listing-page/multi-stepper-form/step4-render";
import RenderStep5 from "@/components/listing-page/register-listing-page/multi-stepper-form/step5-render";
import RenderStep6 from "@/components/listing-page/register-listing-page/multi-stepper-form/step6-render";
import RenderStep7 from "@/components/listing-page/register-listing-page/multi-stepper-form/step7-render";
import RenderStep8 from "@/components/listing-page/register-listing-page/multi-stepper-form/step8-render";
import RenderStep9 from "@/components/listing-page/register-listing-page/multi-stepper-form/step9-render";
import RenderStep10 from "@/components/listing-page/register-listing-page/multi-stepper-form/step10-render";
import RenderStep11 from "@/components/listing-page/register-listing-page/multi-stepper-form/step11-render";
import RenderStep12 from "@/components/listing-page/register-listing-page/multi-stepper-form/step12-render";
import RenderPreviewStep from "@/components/listing-page/register-listing-page/multi-stepper-form/preview-render";
import { useRouter } from "next/navigation";
import ConfirmNewRegistration from "@/components/listing-page/register-listing-page/multi-stepper-form/confirm-registration-render";

const RegisterNewListingPage = () => {
  const progress = useAppSelector(
    (state: RootState) => state.registerListing.progress
  );
  const registerListingStore = useAppSelector(
    (state: RootState) => state.registerListing
  );
  const dispatch: AppDispatch = useAppDispatch();
  const router = useRouter();

  // useEffect(() => {
  //   if (hasCookie("register-listing")) {
  //     console.log("cookie found");
  //     const data = getCookie("register-listing");
  //     const newListing = JSON.parse(data as string);
  //     console.log(registerListingStore);
  //     dispatch(loadRegisterListingSlice(newListing));
  //   } else {
  //     console.log("cookie not found");
  //   }
  // }, []);

  const handleSaveAndExit = () => {
    // const listingData = JSON.stringify(registerListingStore);
    // setCookie("register-listing", listingData); // Backup in cookie
    router.push("/listings/new");
  };

  return (
    <section className="w-full">
      <div className="max-w-4xl mx-auto my-16 p-4 pb-20  min-h-max rounded-sm">
        {renderStep(progress)}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 max-w-7xl mx-auto border-[1px] border-border/90 p-4 rounded-none flex items-center justify-between bg-background">
        <Progress value={(progress / 14) * 100} className="max-w-[500px]" />

        <div className="flex items-center gap-2 w-max">
          <Button
            variant="ghost"
            className="hover:bg-muted"
            onClick={handleSaveAndExit}
          >
            <DoorOpen />
            Exit
          </Button>

          <Button
            variant="outline"
            className="shadow-none hover:shadow-sm"
            disabled={progress === 1}
            onClick={() => dispatch(prevStep())}
          >
            <CircleArrowLeft />
            Prev
          </Button>

          <Button
            className="shadow-none hover:shadow-sm"
            disabled={progress === 14}
            onClick={() => dispatch(nextStep())}
          >
            Next
            <CircleArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
};

const renderStep = (progress: number) => {
  switch (progress) {
    case 1:
      return <RenderStep1 />;
    case 2:
      return <RenderStep2 />;
    case 3:
      return <RenderStep3 />;
    case 4:
      return <RenderStep4 />;
    case 5:
      return <RenderStep5 />;
    case 6:
      return <RenderStep6 />;
    case 7:
      return <RenderStep7 />;
    case 8:
      return <RenderStep8 />;
    case 9:
      return <RenderStep9 />;
    case 10:
      return <RenderStep10 />;
    case 11:
      return <RenderStep11 />;
    case 12:
      return <RenderStep12 />;
    case 13:
      return <RenderPreviewStep />;
    case 14:
      return <ConfirmNewRegistration />;
    default:
      return <div>Unknown Step</div>;
  }
};

export default RegisterNewListingPage;
