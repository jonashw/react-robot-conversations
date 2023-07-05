import { ReactElement } from "react";

const Modal = ({
  shown,
  setShown,
  title,
  children,
  fullscreen,
  scrollable,
  footerContent,
  headerContent,
}: {
  shown: boolean;
  setShown: (shown: boolean) => void;
  title: string;
  children: React.ReactElement;
  fullscreen?: boolean;
  scrollable?: boolean;
  footerContent?: ReactElement;
  headerContent?: ReactElement;
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
            <div
              className="modal-header"
              style={{
                flexFlow:
                  "wrap" /* essential for accepting additional header content*/,
              }}
            >
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={close}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
              {!!headerContent && <div className="w-100">{headerContent}</div>}
            </div>
            <div className="modal-body">{children}</div>
            {!!footerContent && (
              <div className="modal-footer">{footerContent}</div>
            )}
          </div>
        </div>
      </div>
      <div
        className={"modal-backdrop fade " + (shown ? "show d-block" : "d-none")}
        onClick={close}
      ></div>
    </>
  );
};

export default Modal;
