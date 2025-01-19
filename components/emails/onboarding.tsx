import { User } from "@prisma/client";
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import { ArrowRight } from "lucide-react";
import * as React from "react";

const baseURL = (process.env.NEXT_PUBLIC_ORIGIN as string)
  ? (process.env.NEXT_PUBLIC_ORIGIN as string)
  : "http://localhost:3000";

export const OnboardCompleteEmail = (user: User) => {
  const previewText = `Welcome ${user.firstName} to exploreinn!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className=" my-auto mx-auto font-sans px-2 bg-rose-600">
          <Container className="  rounded-xl my-[20px] mx-auto   max-w-[465px] bg-black text-white ">
            <Img
              src={`https://exploreinn-local.s3.ap-south-1.amazonaws.com/logo+white+black+bg+app+icon.png`}
              width="60"
              height="60"
              alt="exploreinn"
              className="my-0 mx-auto mt-5 "
            />
            <Heading className="text-lg  font-medium text-center -mt-1">
              exploreinn
            </Heading>

            <Heading className=" text-[20px] font-medium p-0 mx-auto my-8 text-center text-rose-500">
              Account Onboarding Complete!
            </Heading>

            <Text className=" text-[14px] leading-[24px] px-5">
              Hello{" "}
              <strong className="">
                {user.firstName} {user.lastName}
              </strong>
              ,
            </Text>
            <Text className=" text-[14px] leading-[24px] px-5 ">
              Your onboarding was successful and we're thrilled to have you join
              our community of explorers, adventurers, and travel enthusiasts on
              exploreinn.
              <br />
              Now you can start exploring the world of best in class
              accommodations across the globe with prices which your wallet will
              love.
            </Text>

            <Section className=" px-5 mb-10">
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-2xl border-2 border-white border-solid "
                    src={user.profileImg}
                    width="64"
                    height="64"
                  />
                </Column>
                <Column align="center">
                  <ArrowRight className="" />
                </Column>
                <Column align="left">
                  <Img
                    className=" border-2 border-solid border-rose-600 "
                    src={
                      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/logo+white+rose+bg+app+icon.png"
                    }
                    width="60"
                    height="60"
                  />
                </Column>
              </Row>
            </Section>

            <Hr className="my-5 text-rose-500 border border-rose-500" />

            <Text className=" text-[12px] leading-[24px] px-5">
              This mail was intended for{" "}
              <span className="underline-offset-2 font-medium underline text-rose-500">
                {user.email}
              </span>
              . This invite was sent from{" "}
              <span className="underline-offset-2 font-medium underline text-rose-500">
                {"onboarding@exploreinn.io"}
              </span>
              . If you were not expecting this invitation, you can ignore this
              email. If you are concerned about your account's safety, please
              send an email to{" "}
              <span className="underline-offset-2 font-medium underline text-rose-500">
                support@exploreinn.io
              </span>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OnboardCompleteEmail;
