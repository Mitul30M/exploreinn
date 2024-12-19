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

const RegisterNewListingPage = () => {
  const progress = useAppSelector(
    (state: RootState) => state.registerListing.progress
  );
  const dispatch:AppDispatch = useAppDispatch();

  return (
    <section className="w-full">
      <div className="max-w-4xl mx-auto my-16 p-4  rounded-sm">
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
            disabled={progress === 0}
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
    case 0:
      return <RenderStep1 />;
    case 1:
      return "Step2";
    case 2:
      return "Step3";
    default:
      return <div>Unknown Step</div>;
  }
};

export default RegisterNewListingPage;
