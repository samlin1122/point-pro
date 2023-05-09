// Libs
// Components
import withMobileLayout from "~/hoc/create-mobile-layout";
import Booking from "~/features/booking";
// Styles

interface IBookingPageProps {}

const BookingPage = (props: IBookingPageProps) => {
  return <Booking {...props} />;
};

export default withMobileLayout(BookingPage);
