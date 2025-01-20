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

const baseURL = process.env.NEXT_PUBLIC_ORIGIN as string;

export const OnboardCompleteEmail = (user: User) => {
  const previewText = `Welcome ${user.firstName} to exploreinn!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className=" my-auto mx-auto font-sans   ">
          <Container className="mx-auto border  mb-0 max-w-[465px] bg-black text-white ">
            <Section className="mb-0  ">
              <Row className="justify-between p-2 bg-black ">
                <Column align="left">
                  <Img
                    src={`https://exploreinn-local.s3.ap-south-1.amazonaws.com/logo+white+black+bg+app+icon.png`}
                    width="55"
                    height="55"
                    alt="exploreinn"
                    className="my-0 w-max"
                  />
                </Column>
                <Column align="right">
                  <Button href={baseURL} className="text-white">
                    <Heading className="text-[20px] text-white pb-0 my-0 font-medium -mt-1 mr-5">
                      exploreinn
                    </Heading>
                  </Button>
                </Column>
              </Row>

              <Row className="px-0 mx-0 bg-rose-600">
                <Column align="left" className="px-5">
                  <Text className="text-[18px] font-medium text-white leading-8">
                    Where Your Journey Begins,
                    <br />& Memories Stay.
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="mb-0  ">
              <Heading className=" text-[20px] font-semibold p-0 mx-auto px-5 my-10">
                Account Onboarding Complete!
              </Heading>

              <Text className=" text-[14px] leading-[24px] px-5">
                Hey{" "}
                <strong className="">
                  {user.firstName} {user.lastName}
                </strong>
                !
              </Text>
              <Text className=" text-[16px] leading-[24px] px-5 ">
                Welcome aboard! We’re absolutely delighted to have you join our
                amazing community of explorers, adventurers, and travel
                enthusiasts here at exploreInn.
                <br />
                The world is now at your fingertips! Get ready to discover the
                best accommodations across the globe with unbeatable prices
                that’ll make your wallet smile.
              </Text>
            </Section>

            <Section className=" px-5 mt-6 ">
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-2xl border border-zinc-200 border-solid "
                    src={user.profileImg}
                    width="60"
                    height="60"
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

            <Section className="text-center mt-[32px] mb-[32px] ">
              <Button
                className="bg-black rounded-3xl border-[#e11d48] border-2 border-solid  text-white text-[14px] font-semibold no-underline text-center px-7 py-3 "
                href={`${baseURL}/users/${user.id}`}
              >
                Account
              </Button>
            </Section>

            <Section className="bg-rose-600 mt-10 p-5 py-2">
              <Row>
                <Column align="center">
                  <Link
                    href="#"
                    className="text-white text-[14px] mr-2 font-medium no-underline"
                  >
                    Instagram
                  </Link>
                  <Link
                    href="#"
                    className="text-white mr-2 text-[14px] font-medium no-underline"
                  >
                    Threads
                  </Link>
                  <Link
                    href="#"
                    className="text-white mr-2 text-[14px] font-medium no-underline"
                  >
                    Twitter
                  </Link>
                </Column>
              </Row>
            </Section>

            <Text className=" text-[12px] leading-[24px] p-5 py-4 my-0  text-white">
              This email was intended for{" "}
              <span className="underline-offset-2 font-medium underline text-rose-500">
                {user.email}
              </span>
              . It was sent from{" "}
              <span className="underline-offset-2 font-medium underline text-rose-500">
                onboarding@exploreinn.io
              </span>
              .
              <br />
              If you weren’t expecting this email, feel free to ignore it. If
              you’re concerned about the safety of your account, please don’t
              hesitate to contact us at{" "}
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

OnboardCompleteEmail.PreviewProps = {
  id: "678ce217c5af03dd266a1f45",
  clerkId: "user_2rqTz4yOUCbOG9JrOWSKmE7o5VA",
  stripeId: "acct_1QiwguQ52YLXA09X",
  isStripeConnectedAccount: false,
  role: "User",
  email: "mitul30m@icloud.com",
  phoneNo: "+917045250005",
  firstName: "Mitul",
  lastName: "Mungase",
  profileImg:
    "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ycHZrVG9hMElFdVlqSlh4RVJaY0J0YnRzUW8iLCJyaWQiOiJ1c2VyXzJycVR6NHlPVUNiT0c5SnJPV1NLbUU3bzVWQSIsImluaXRpYWxzIjoiTU0ifQ",
  createdAt: new Date("2025-01-19T11:29:24.795Z"),
  updatedAt: new Date("2025-01-19T11:41:49.636Z"),
  dob: new Date("2005-01-29T18:30:00.000Z"),
  gender: "Male",
  country: "India",
  address: {
    residence: "101, 1st Floor, Dream Apts",
    street: "Saint Mary's Street",
    city: "Mumbai",
    province: "Maharashtra",
    landmark: "",
    postalCode: "421201",
  },
} as User;

export default OnboardCompleteEmail;
