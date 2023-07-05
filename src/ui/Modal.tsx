import { ReactElement } from "react";

const Modal = ({
  shown,
  setShown,
  title,
  children,
  fullscreen,
  scrollable,
  footerContent,
}: {
  shown: boolean;
  setShown: (shown: boolean) => void;
  title: string;
  children: React.ReactElement;
  fullscreen?: boolean;
  scrollable?: boolean;
  footerContent?: ReactElement;
}) => {
  const close = () => {
    setShown(false);
  };

  return (
    <>
      <div
        className={"modal fade" + (!!shown ? " d-block show" : "d-none")}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        style={{
          zIndex: 3000,
          pointerEvents:
            "none" /* to allow backdrop clicks to close the modal*/,
        }}
      >
        <div
          className={
            "modal-dialog modal-dialog-centered" +
            (fullscreen ? " modal-fullscreen" : "") +
            (scrollable ? " modal-dialog-scrollable" : "")
          }
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={close}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
        {!!footerContent && <div className="modal-footer">{footerContent}</div>}
      </div>
      <div
        className={"modal-backdrop fade " + (shown ? "show d-block" : "d-none")}
        onClick={close}
      ></div>
    </>
  );
};

export default Modal;
