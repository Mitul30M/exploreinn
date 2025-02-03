import { Booking, Listing, Transaction, User } from "@prisma/client";
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
import { format } from "date-fns";
import * as React from "react";

const baseURL = process.env.NEXT_PUBLIC_ORIGIN as string;

const BookingConfirmationMail = ({
  user,
  booking,
  listing,
}: {
  user: User;
  booking: Booking;
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
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(booking.totalCost)}
                </strong>{" "}
                (inclusive of all taxes) needs to be processed during your check
                in. You have 2 days until you can opt to cancel the Booking.
                Cancellations after 48hrs from booking would result in a charge
                of 1 night’s stay.
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

BookingConfirmationMail.PreviewProps = {
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
  booking: {
    id: "678a7cb150c81a45fe6b4b72",
    createdAt: new Date("2025-01-17T15:52:17.085Z"),
    updatedAt: new Date("2025-01-17T15:52:17.085Z"),
    listingId: "678a7c0c50c81a45fe6b4b70",
    guestId: "6789e51a0426fc58cdd53323",
    checkInDate: new Date("2025-01-29T18:30:00.000Z"),
    checkOutDate: new Date("2025-01-30T18:30:00.000Z"),
    guests: 1,
    bookingType: "BOOK_NOW_PAY_LATER",
    paymentStatus: "pending",
    tax: 367.2,
    totalCost: 2917.2,
    bookingStatus: "upcoming",
    specialNote: "",
    rooms: [
      {
        roomId: "678a7c0c50c81a45fe6b4b71",
        name: "Deluxe Room",
        rate: 1000,
        noOfRooms: 1,
      },
    ],
    extras: [
      {
        name: "Breakfast + Lunch + Dinner Buffet",
        cost: 1550,
      },
    ],
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
    transactionId: null,
    paymentId: null,
  } satisfies Booking,
  listing: {
    id: "678a7c0c50c81a45fe6b4b70",
    name: "Hotel Aloha, Boston",
    type: "Hotel",
    email: "info@hotelaloha.us",
    phoneNo: "+16175551234",
    description:
      "<p>Pellentesque ac leo nulla. Suspendisse et mattis eros, volutpat tempor velit. Aenean placerat eros eu dui porttitor sollicitudin. Sed eu convallis nisi. Vivamus bibendum enim quis ante lobortis, sit amet porttitor urna malesuada. Nunc faucibus malesuada ex consectetur convallis. In tellus mauris, pulvinar ut ipsum at, vestibulum commodo ipsum. Nulla non turpis mauris. Aliquam et risus et tellus malesuada accumsan. Nunc a ante sed tellus maximus interdum. Nam condimentum sollicitudin mi, eget rhoncus quam tincidunt porta. Aliquam dignissim ullamcorper dolor sit amet malesuada. Morbi eu est vehicula magna consectetur condimentum. Nam rutrum nec justo eu euismod.</p><p>Maecenas sit amet vehicula leo. Nulla rhoncus sodales eros. Cras placerat ut sapien nec efficitur. Donec magna purus, imperdiet in aliquam id, laoreet pharetra ex. Suspendisse vulputate eget arcu vel scelerisque. Cras nec lorem id odio ultricies vestibulum. Etiam luctus ut urna eget placerat. Morbi eu enim turpis. Morbi vel ultrices lacus. Sed in volutpat orci. Duis semper massa sed velit dapibus elementum. Nulla vel elementum nulla. Nullam vel elit eget neque vehicula dapibus in non eros. In non odio et odio commodo molestie.</p><p>Quisque commodo, ex eget auctor sollicitudin, diam arcu lobortis metus, a feugiat felis mi in mi. Suspendisse potenti. Nunc ornare volutpat felis in egestas. Nunc vitae quam congue velit iaculis scelerisque. Etiam aliquam libero ac eros rhoncus, in mattis justo fermentum. Nulla facilisi. Aliquam ac pellentesque enim, non pretium dui. Donec eget lectus auctor, ultrices augue vitae, vulputate ipsum. Etiam at aliquet enim. Aenean semper consectetur risus, non pharetra magna rutrum non. Duis justo lorem, semper sit amet lacus sit amet, vulputate pulvinar turpis.</p>",
    checkInTime: "11:00",
    checkOutTime: "10:30",
    createdAt: new Date("2025-01-17T15:49:31.857Z"),
    updatedAt: new Date("2025-01-17T15:49:31.857Z"),
    images: [
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-eb8b628efb9e19d27314a47e588d64e8a59a9fec382c4bc28c805013cc8b77a1",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-b2199d4c4e1d13f8e56077ab64df9f8645fee3a7d7f9e186a9804d0037059e47",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-247ddd60813cb8b8d65bf7f6917af3986289e6bdb828865c7451b85fdb264b2a",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-01d34a247018e18bec799603191924e2915bb073fb6e084f3164efbdaf2390f4",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-dd27ba8d6a6e27802be30ac704ad103639a8ad33c5725c641be2fbf8d0f2b599",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-cbb7c24eb83714e9dc08dda5f33146a82386be58d2f898d971598cb6de9750f3",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-6dc512dc2cd85ba38c6bc5bb9c69d06675486f6018b59b2f52255f6d1d707d55",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-08365c4607b6d1ea16e17f0c4545e5dc6baa27355fc3d29986262ae2aa09eaba",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-6411f71a591df05726132f76f88e5b537cb5619a947195c89529d0023ae84533",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-d810c0daef4908e9abb4bf20205eaa7c6de12cf01587044c49d2ec97a6047d56",
    ],
    legalDocs: [
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-5891a01fa628227fe6d590f58a022731498ce43b86ac74d78bec939b06a25632",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-0d09c51f5e5fdec786caad1878078027fc0279af322491824f841b66f722245a",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-e4ee6ef16b2e882e6d621201d44be164d808c07a8416e8a075bf8739e14fa448",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-a57521199cb29f0af9dd641fa72c92eff750930aa5c214b426bd995b72e5a45d",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-a3d479a3b5f2d8c87c344d74e44d8ca8ce01cdde99c108359d055ad6ae368c3c",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-247ea57587020896f817e3e69110830ca639de4db73e52e8cee525a4c9aa2cb8",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-7f255e70a7df8f25d62d6042edfbae611ac53cc0f4f655a76c548685aef2f4fc",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-49846f274bc69d6086334daa6b3e7005e662a356016c4fe17364ff4a78244e0f",
    ],
    coverImage:
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-6411f71a591df05726132f76f88e5b537cb5619a947195c89529d0023ae84533",
    taxIN: "NWDN2EREQNJKO2",
    isBookNowPayLaterAllowed: true,
    checkInRulesAndRestrictions:
      "<p>Pellentesque ac leo nulla. Suspendisse et mattis eros, volutpat tempor velit. Aenean placerat eros eu dui porttitor sollicitudin. Sed eu convallis nisi. Vivamus bibendum enim quis ante lobortis, sit amet porttitor urna malesuada. Nunc faucibus malesuada ex consectetur convallis. In tellus mauris, pulvinar ut ipsum at, vestibulum commodo ipsum. Nulla non turpis mauris. Aliquam et risus et tellus malesuada accumsan. Nunc a ante sed tellus maximus interdum. Nam condimentum sollicitudin mi, eget rhoncus quam tincidunt porta. Aliquam dignissim ullamcorper dolor sit amet malesuada. Morbi eu est vehicula magna consectetur condimentum. Nam rutrum nec justo eu euismod.</p><p>Maecenas sit amet vehicula leo. Nulla rhoncus sodales eros. Cras placerat ut sapien nec efficitur. Donec magna purus, imperdiet in aliquam id, laoreet pharetra ex. Suspendisse vulputate eget arcu vel scelerisque. Cras nec lorem id odio ultricies vestibulum. Etiam luctus ut urna eget placerat. Morbi eu enim turpis. Morbi vel ultrices lacus. Sed in volutpat orci. Duis semper massa sed velit dapibus elementum. Nulla vel elementum nulla. Nullam vel elit eget neque vehicula dapibus in non eros. In non odio et odio commodo molestie.</p><p>Quisque commodo, ex eget auctor sollicitudin, diam arcu lobortis metus, a feugiat felis mi in mi. Suspendisse potenti. Nunc ornare volutpat felis in egestas. Nunc vitae quam congue velit iaculis scelerisque. Etiam aliquam libero ac eros rhoncus, in mattis justo fermentum. Nulla facilisi. Aliquam ac pellentesque enim, non pretium dui. Donec eget lectus auctor, ultrices augue vitae, vulputate ipsum. Etiam at aliquet enim. Aenean semper consectetur risus, non pharetra magna rutrum non. Duis justo lorem, semper sit amet lacus sit amet, vulputate pulvinar turpis.</p>",
    groundRulesAndRestrictions:
      "<p>Pellentesque ac leo nulla. Suspendisse et mattis eros, volutpat tempor velit. Aenean placerat eros eu dui porttitor sollicitudin. Sed eu convallis nisi. Vivamus bibendum enim quis ante lobortis, sit amet porttitor urna malesuada. Nunc faucibus malesuada ex consectetur convallis. In tellus mauris, pulvinar ut ipsum at, vestibulum commodo ipsum. Nulla non turpis mauris. Aliquam et risus et tellus malesuada accumsan. Nunc a ante sed tellus maximus interdum. Nam condimentum sollicitudin mi, eget rhoncus quam tincidunt porta. Aliquam dignissim ullamcorper dolor sit amet malesuada. Morbi eu est vehicula magna consectetur condimentum. Nam rutrum nec justo eu euismod.</p><p>Maecenas sit amet vehicula leo. Nulla rhoncus sodales eros. Cras placerat ut sapien nec efficitur. Donec magna purus, imperdiet in aliquam id, laoreet pharetra ex. Suspendisse vulputate eget arcu vel scelerisque. Cras nec lorem id odio ultricies vestibulum. Etiam luctus ut urna eget placerat. Morbi eu enim turpis. Morbi vel ultrices lacus. Sed in volutpat orci. Duis semper massa sed velit dapibus elementum. Nulla vel elementum nulla. Nullam vel elit eget neque vehicula dapibus in non eros. In non odio et odio commodo molestie.</p><p>Quisque commodo, ex eget auctor sollicitudin, diam arcu lobortis metus, a feugiat felis mi in mi. Suspendisse potenti. Nunc ornare volutpat felis in egestas. Nunc vitae quam congue velit iaculis scelerisque. Etiam aliquam libero ac eros rhoncus, in mattis justo fermentum. Nulla facilisi. Aliquam ac pellentesque enim, non pretium dui. Donec eget lectus auctor, ultrices augue vitae, vulputate ipsum. Etiam at aliquet enim. Aenean semper consectetur risus, non pharetra magna rutrum non. Duis justo lorem, semper sit amet lacus sit amet, vulputate pulvinar turpis.</p>",
    cancellationPolicy:
      "<p>Pellentesque ac leo nulla. Suspendisse et mattis eros, volutpat tempor velit. Aenean placerat eros eu dui porttitor sollicitudin. Sed eu convallis nisi. Vivamus bibendum enim quis ante lobortis, sit amet porttitor urna malesuada. Nunc faucibus malesuada ex consectetur convallis. In tellus mauris, pulvinar ut ipsum at, vestibulum commodo ipsum. Nulla non turpis mauris. Aliquam et risus et tellus malesuada accumsan. Nunc a ante sed tellus maximus interdum. Nam condimentum sollicitudin mi, eget rhoncus quam tincidunt porta. Aliquam dignissim ullamcorper dolor sit amet malesuada. Morbi eu est vehicula magna consectetur condimentum. Nam rutrum nec justo eu euismod.</p><p>Maecenas sit amet vehicula leo. Nulla rhoncus sodales eros. Cras placerat ut sapien nec efficitur. Donec magna purus, imperdiet in aliquam id, laoreet pharetra ex. Suspendisse vulputate eget arcu vel scelerisque. Cras nec lorem id odio ultricies vestibulum. Etiam luctus ut urna eget placerat. Morbi eu enim turpis. Morbi vel ultrices lacus. Sed in volutpat orci. Duis semper massa sed velit dapibus elementum. Nulla vel elementum nulla. Nullam vel elit eget neque vehicula dapibus in non eros. In non odio et odio commodo molestie.</p><p>Quisque commodo, ex eget auctor sollicitudin, diam arcu lobortis metus, a feugiat felis mi in mi. Suspendisse potenti. Nunc ornare volutpat felis in egestas. Nunc vitae quam congue velit iaculis scelerisque. Etiam aliquam libero ac eros rhoncus, in mattis justo fermentum. Nulla facilisi. Aliquam ac pellentesque enim, non pretium dui. Donec eget lectus auctor, ultrices augue vitae, vulputate ipsum. Etiam at aliquet enim. Aenean semper consectetur risus, non pharetra magna rutrum non. Duis justo lorem, semper sit amet lacus sit amet, vulputate pulvinar turpis.</p>",
    ownerId: "6789fd79c59d9fa2d89e299c",
    managerIds: [],
    amenities: [
      "WiFi",
      "King-Size Bed",
      "Restaurant",
      "24/7 Room Service",
      "Air Conditioning",
      "Swimming Pool",
      "Local Dining",
      "Housekeeping",
      "Bath/Shower",
      "Free Parking",
      "Spa",
      "Laundry Service",
      "Play Area",
      "Microwave",
      "TV",
      "Hair Dryer",
      "Baggage Storage",
      "Smoking Allowed",
      "Bar",
      "Power Backup",
      "Safe Locker",
      "24/7 Help Desk",
      "Security Alarm",
      "Smoke Detector",
      "CCTV Camera",
      "Key Card Access",
      "Fire Extinguisher",
      "Elevator",
      "Wheelchair Accessible",
      "Conference Room",
      "Meeting Room",
      "Concierge Service",
      "Tour Assistance",
      "Multi Linguage Staff",
      "ATM",
      "Currency Exchange",
      "Car Rental",
      "Airport Shuttle",
      "In-house Casino",
    ],
    starRating: 3.5,
    overallRating: 7,
    exploreinnGrade: "Good",
    tags: ["Enchanting", "Modern", "Premium"],
    geometry: {
      type: "Point",
      coordinates: [-71.07463251661498, 42.35129882553639],
    },
    address: {
      street: "501b Boylston Street",
      neighborhood: "Newbury Street",
      city: "Boston",
      state: "Massachusetts",
      country: "United States",
      zipCode: "02116",
      fullAddress:
        "501b Boylston Street, Boston, Massachusetts 02116, United States",
      landmark: "",
    },
    distanceFrom: {
      touristDestinations: [
        {
          name: "Boston Musuem",
          distance: 1.2,
        },
        {
          name: "Boston City Center",
          distance: 1.8,
        },
      ],
      airport: {
        name: "Boston Logan International Airport (BOS)",
        distance: 4.83,
      },
      railwayStation: {
        name: "Mbta West Medford",
        distance: 9.22,
      },
      busStop: {
        name: "Boylston",
        distance: 0.13,
      },
    },
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
    socialMediaLinks: [
      {
        name: "Instagram",
        link: "https://instagram/accounts/hotel-aloha-boston",
      },
      {
        name: "Twitter",
        link: "https://twitter/accounts/hotel-aloha-boston",
      },
    ],
  } satisfies Listing,
};
export default BookingConfirmationMail;
