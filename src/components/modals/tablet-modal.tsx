import { useAppDispatch } from "~/app/hook";
import { clearCart, closeModal } from "~/features/orders/slice";
import ModalBase from "./modal-base";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import theme from "~/theme";
import { deleteOrder, postOrder } from "~/app/slices/order";

interface ITabletModalLayout {
  children: React.ReactNode;
  open: boolean;
}
const TabletModalLayout = (props: ITabletModalLayout) => {
  const { children, open } = props;

  return (
    <ModalBase open={open}>
      <Box display="grid" sx={{ placeContent: "center" }} height="100%">
        {children}
      </Box>
    </ModalBase>
  );
};

type ClearCartConfirmProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const ClearCartConfirm = (props: ClearCartConfirmProps) => {
  const { open, setOpen } = props;
  const dispatch = useAppDispatch();

  const handleClearCart = () => {
    dispatch(clearCart());
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <TabletModalLayout open={open}>
      <Card>
        <CardHeader
          title="清空購物車"
          sx={{ backgroundColor: theme.palette.common.black, color: "white", textAlign: "center" }}
        />
        <CardContent sx={{ padding: "1.5rem 1.25rem", minWidth: "50cqw" }}>
          <Typography component="p" variant="body1" fontWeight={700} textAlign={"center"}>
            確定要刪除購物車內所有項目？
          </Typography>
        </CardContent>
        <CardActions sx={{ gap: "1.5rem", justifyContent: "center", alignItems: "center", padding: "1.5rem" }}>
          <Button variant="outlined" color="inherit" fullWidth onClick={handleClearCart}>
            確定
          </Button>
          <Button variant="contained" color="secondary" fullWidth onClick={handleCancel}>
            取消
          </Button>
        </CardActions>
      </Card>
    </TabletModalLayout>
  );
};

type SubmitOrderConfirmProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const SubmitOrderConfirm = (props: SubmitOrderConfirmProps) => {
  const { open, setOpen } = props;
  const dispatch = useAppDispatch();

  const handleSubmitOrder = async () => {
    const res = await dispatch(postOrder());
    // [TODO] get order id from res
    console.log({ res });
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <TabletModalLayout open={open}>
      <Card>
        <CardHeader
          title="送出訂單"
          sx={{ backgroundColor: theme.palette.common.black, color: "white", textAlign: "center" }}
        />
        <CardContent sx={{ padding: "1.5rem 1.25rem", minWidth: "50cqw" }}>
          <Typography component="p" variant="body1" fontWeight={700} textAlign={"center"}>
            確定訂單內容無誤？
          </Typography>
        </CardContent>
        <CardActions sx={{ gap: "1.5rem", justifyContent: "center", alignItems: "center", padding: "1.5rem" }}>
          <Button variant="outlined" color="inherit" fullWidth onClick={handleSubmitOrder}>
            確定
          </Button>
          <Button variant="contained" color="secondary" fullWidth onClick={handleCancel}>
            取消
          </Button>
        </CardActions>
      </Card>
    </TabletModalLayout>
  );
};

type CancelOrderConfirmProps = {
  deleteOrderId: string;
  setDeleteOrderId: React.Dispatch<React.SetStateAction<string>>;
};
const CancelOrderConfirm = (props: CancelOrderConfirmProps) => {
  const { deleteOrderId, setDeleteOrderId } = props;

  const dispatch = useAppDispatch();

  const handleDeleteOrder = () => {
    dispatch(deleteOrder({ orderId: deleteOrderId }));
    setDeleteOrderId("");
  };

  const handleCancel = () => {
    setDeleteOrderId("");
  };

  return (
    <TabletModalLayout open={!!deleteOrderId}>
      <Box display="grid" sx={{ placeContent: "center" }} height={"100%"}>
        <Card>
          <CardHeader
            title="取消訂單"
            sx={{ backgroundColor: theme.palette.common.black, color: "white", textAlign: "center" }}
          />
          <CardContent sx={{ padding: "1.5rem 1.25rem", minWidth: "50cqw" }}>
            <Typography component="p" variant="body1" fontWeight={700} textAlign={"center"}>
              確定要取消此訂單？
            </Typography>
          </CardContent>
          <CardActions sx={{ gap: "1.5rem", justifyContent: "center", alignItems: "center", padding: "1.5rem" }}>
            <Button variant="outlined" color="inherit" fullWidth onClick={handleDeleteOrder}>
              確定
            </Button>
            <Button variant="contained" color="secondary" fullWidth onClick={handleCancel}>
              取消
            </Button>
          </CardActions>
        </Card>
      </Box>
    </TabletModalLayout>
  );
};
export default {
  ClearCartConfirm,
  SubmitOrderConfirm,
  CancelOrderConfirm
};
