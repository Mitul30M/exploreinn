import { Booking, Listing, Transaction, User } from "@prisma/client";
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
import { format } from "date-fns";
import * as React from "react";

const baseURL = process.env.NEXT_PUBLIC_ORIGIN as string;

const OnlinePaymentBookingComplete = ({
  user,
  booking,
  transaction,
  listing,
}: {
  user: User;
  booking: Booking;
  transaction: Transaction;
  listing: Listing;
}) => {
  const previewText = `Booking for your next stay is complete!`;
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
                Online Booking Successful!
              </Heading>

              <Text className=" text-[14px] leading-[24px] px-5">
                Hey{" "}
                <strong className="">
                  {user.firstName} {user.lastName}
                </strong>
                !
              </Text>
              <Text className=" text-[16px] leading-[24px] px-5 ">
                Your booking at{" "}
                <strong className="font-semibold">
                  {listing.name}, {listing.address.city}
                </strong>{" "}
                has been successfully confirmed! A payment of{" "}
                <strong className="font-semibold">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(transaction.totalCost)}
                </strong>{" "}
                (inclusive of all taxes) has been securely processed.
                <br /> Thank you for choosing ExploreInn as your travel
                companion. We can’t wait to make your stay at Hotel Aloha an
                exceptional and unforgettable experience!
              </Text>

              <Text className=" text-[16px] leading-[24px] px-5 ">
                Listing:{" "}
                <strong className="font-semibold">
                  {listing.name}, {listing.address.city}
                </strong>
                <br />
                Address:{" "}
                <strong className="font-semibold">
                  {listing.address.fullAddress}
                </strong>
                <br />
                Check In Date:{" "}
                <strong className="font-semibold">
                  {format(new Date(booking.checkInDate), "dd MMM yyyy")}
                </strong>
                <br />
                Check Out Date:{" "}
                <strong className="font-semibold">
                  {format(new Date(booking.checkOutDate), "dd MMM yyyy")}
                </strong>
                <br />
                Booking ID:{" "}
                <strong className="font-semibold">{booking.id}</strong>
                <br />
                Transaction ID:{" "}
                <strong className="font-semibold">{transaction.id}</strong>
              </Text>

              <Text className=" text-[16px] leading-[24px] px-5 ">
                We&apos;ll mail you the invoice & payment receipt as soon as
                it&apos;s ready. Please ensure that you follow all the rules and
                regulations of the listing to help us maintain a safe and
                pleasant environment for everyone.
              </Text>
            </Section>

            <Section className="text-center mt-6 ">
              <Button
                className="bg-rose-600 rounded   text-white text-[14px] font-semibold no-underline text-center px-7 py-3 "
                href={`${baseURL}/users/${user.id}/bookings/${booking.id}`}
              >
                My Bookings
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

export default OnlinePaymentBookingComplete;
