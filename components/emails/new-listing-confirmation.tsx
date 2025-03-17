import { Listing, User } from "@prisma/client";
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import { PartyPopper } from "lucide-react";
import * as React from "react";

const baseURL = process.env.NEXT_PUBLIC_ORIGIN as string;

const NewListingConfirmationEmail = ({
  user,
  listing,
}: {
  user: User;
  listing: Listing;
}) => {
  const previewText = `${listing.name} has been registered successfully to exploreinn!`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className=" my-auto mx-auto font-sans  p-0 bg-rose-600">
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
                {listing.name} has been registered successfully!
              </Heading>

              <Text className=" text-[14px] leading-[24px] px-5">
                Hey{" "}
                <strong className="">
                  {user.firstName} {user.lastName}
                </strong>
                !
              </Text>
              <Text className=" text-[16px] leading-[24px] px-5 ">
                Congratulations! Your listing,{" "}
                <strong className="font-semibold">{listing.name}</strong>, has
                been successfully registered on exploreinn!
              </Text>

              <Text className=" text-[16px] leading-[24px] px-5 ">
                We’re thrilled to welcome your property to our growing network
                of exceptional stays. By listing with us, you’ve taken the first
                step toward connecting with travelers from all over the world
                and maximizing your property’s potential.
              </Text>

              <Text className=" text-[16px] leading-[24px] px-5 ">
                Our platform is designed to make managing your listing seamless
                and efficient, so you can focus on providing an outstanding
                experience to your guests. From real-time booking updates to
                dynamic pricing options, we’ve got everything you need to stand
                out in today’s competitive market.
              </Text>
            </Section>

            <Button
              className="rounded   text-white text-[14px] font-semibold no-underline text-center px-7 py-3 "
              href={`${baseURL}/users/${user.id}/listings/${listing.id}`}
            >
              <Section className="my-[16px] text-center">
                <Section className="inline-block w-full  max-w-[250px] text-left align-top">
                  <Text className="m-0 text-[16px] font-semibold leading-[24px] text-rose-600">
                    <PartyPopper />
                  </Text>
                  <Text className="m-0 mt-[8px] text-[20px] font-semibold leading-[28px]">
                    {listing.name}
                  </Text>
                  <Text className="mt-[8px] text-[16px] leading-[24px] text-zinc-200">
                    {listing.address.fullAddress}
                  </Text>
                </Section>
                <Section className="my-[8px] inline-block w-full max-w-[250px] align-top">
                  <Img
                    alt={listing.name}
                    className="rounded-[8px] object-cover"
                    height={220}
                    src={listing.coverImage}
                    width={240}
                  />
                </Section>
              </Section>
            </Button>

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
                bookings@exploreinn.io
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

export default NewListingConfirmationEmail;
