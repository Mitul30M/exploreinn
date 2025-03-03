import { Booking, Transaction, User } from "@prisma/client";
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
import * as React from "react";

const baseURL = process.env.NEXT_PUBLIC_ORIGIN as string;

const Invoice = ({
  user,
  transaction,
}: {
  user: User;
  booking: Booking;
  transaction: Transaction;
}) => {
  const previewText = `Invoice for your recent transaction!`;
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
                Stripe Issued Invoice
              </Heading>

              <Text className=" text-[14px] leading-[24px] px-5">
                Hey{" "}
                <strong className="">
                  {user.firstName} {user.lastName}
                </strong>
                !
              </Text>
              <Text className=" text-[16px] leading-[24px] px-5 ">
                Your transaction of{" "}
                <strong className="font-semibold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(transaction.totalCost)}
                </strong>{" "}
                with ID{" "}
                <strong className="font-semibold">{transaction.id}</strong> was
                successful & securely processed!
              </Text>
              <Text className=" text-[16px] leading-[24px] px-5 ">
                Thank you for choosing ExploreInn as your travel companion.
              </Text>
            </Section>

            <Section className="text-center mt-6 ">
              <Button
                className="bg-rose-600 rounded   text-white text-[14px] font-semibold no-underline text-center px-7 py-3 "
                href={transaction.receiptURL ?? ""}
              >
                Invoice
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

Invoice.PreviewProps = {
  user: {
    id: "6789e51a0426fc58cdd53323",
    clerkId: "user_2rk5ct0gzCA3JTuAxFkGl1batTq",
    stripeId: "acct_1Qi7kJQ57eeGwecJ",
    isStripeConnectedAccount: false,
    role: "User",
    email: "jessie+clerk_test@example.com",
    phoneNo: "+11015550101",
    firstName: "Jessie",
    lastName: "Doe",
    profileImg:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJyazVxd1NoZVVRVU1ydjJINzVUemlGelVpeiJ9",
    createdAt: new Date("2025-01-17T05:05:30.236Z"),
    updatedAt: new Date("2025-01-17T05:07:07.609Z"),
    dob: new Date("2005-01-29T18:30:00.000Z"),
    gender: "Female",
    country: "United States",
    address: {
      residence: "101, 1st Floor, Dream Apts",
      street: "Saint Mary's Street",
      city: "Manhattan",
      province: "New York",
      landmark: "",
      postalCode: "10001",
    },
    managedListingIds: [],
  } satisfies User,
  transaction: {
    id: "678a7e8750c81a45fe6b4b74",
    paymentId: "pi_3QiHxSLq2IOwmPMu03Fwea9u",
    listingId: "678a7c0c50c81a45fe6b4b70",
    guestId: "6789e51a0426fc58cdd53323",
    bookingId: "678a7e8650c81a45fe6b4b73",
    bookingType: "ONLINE_PAYMENT",
    paymentStatus: "completed",
    tax: 144,
    totalCost: 1144,
    receiptURL:
      "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUWdVQkhMcTJJT3dtUE11KPL8qbwGMgYspByUB6A6LBYlgFA6PUaCPygYTsoLYDM84dX8vldYLp4t2CYifCJKCULL0JBXJJxtIz2V",
    createdAt: new Date("2025-01-17T16:00:07.935Z"),
    updatedAt: new Date("2025-01-17T16:00:07.935Z"),
    taxRates: [
      {
        name: "State Room Occupancy Excise Tax",
        rate: 5.7,
      },
      {
        name: "Local Option Room Occupancy Tax",
        rate: 2.5,
      },
      {
        name: "Convention Center Financing Fee",
        rate: 2.2,
      },
      {
        name: "Tourism Assessment Fee",
        rate: 4,
      },
    ],
    paymentMethod: "ONLINE_PAYMENT",
    card: {
      billingEmail: "jessie+clerk_test@example.com",
      billingPhone: null,
      billingName: "Jessie Doe",
      cardBrand: "mastercard",
      last4: "4444",
      expMonth: 1,
      expYear: 2030,
    },
    chargedAt: null,
    refundedAt: null,
  } satisfies Transaction,
};
export default Invoice;
