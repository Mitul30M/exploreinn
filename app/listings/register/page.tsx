"use client";
import { Button } from "@/components/ui/button";
import { CircleArrowLeft, CircleArrowRight, SaveIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  nextStep,
  prevStep,
} from "@/lib/redux-store/slices/register-listing-slice";
import RenderStep1 from "@/components/listing-page/register-listing-page/multi-stepper-form/step1-render";
import RenderStep2 from "@/components/listing-page/register-listing-page/multi-stepper-form/step2-render";
import RenderStep3 from "@/components/listing-page/register-listing-page/multi-stepper-form/step3-render";
import RenderStep4 from "@/components/listing-page/register-listing-page/multi-stepper-form/step4-render";
import TextEditor from "@/components/ui/text-editor/tip-tap-editor";
import RenderStep5 from "@/components/listing-page/register-listing-page/multi-stepper-form/step5-render";
import RenderStep6 from "@/components/listing-page/register-listing-page/multi-stepper-form/step6-render";
import RenderStep7 from "@/components/listing-page/register-listing-page/multi-stepper-form/step7-render";
import RenderStep8 from "@/components/listing-page/register-listing-page/multi-stepper-form/step8-render";
import RenderStep9 from "@/components/listing-page/register-listing-page/multi-stepper-form/step9-render";
import RenderStep10 from "@/components/listing-page/register-listing-page/multi-stepper-form/step10-render";
import RenderStep11 from "@/components/listing-page/register-listing-page/multi-stepper-form/step11-render";

const RegisterNewListingPage = () => {
  const progress = useAppSelector(
    (state: RootState) => state.registerListing.progress
  );
  const dispatch: AppDispatch = useAppDispatch();

  return (
    <section className="w-full">
      <div className="max-w-4xl mx-auto my-16 p-4 pb-20  min-h-max rounded-sm">
        {renderStep(progress)}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 max-w-7xl mx-auto border-[1px] border-border/90 p-4 rounded-none flex items-center justify-between bg-background">
        <Progress value={progress} className="max-w-[500px]" />

        <div className="flex items-center gap-2 w-max">
          <Button variant="ghost" className="hover:bg-muted">
            <SaveIcon />
            Save & Exit
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
      return;
    default:
      return <div>Unknown Step</div>;
  }
};

export default RegisterNewListingPage;
