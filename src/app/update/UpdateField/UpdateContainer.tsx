import React, { useState } from "react";
import { useAuthContext } from "../../../../context/AuthContext";
import styles from "@/app/page.module.css";
import { useEffect } from "react";
import { Cord, LinkType, TreeType } from "../../../../types/types";
import Tree from "../../../../components/Tree";
import GridLayout from "react-grid-layout";
import { MdDelete, MdOutlineDriveFolderUpload } from "react-icons/md";
import { useRouter } from "next/navigation";
import ColorPicker from "./ColorPicker";

const UpdateContainer = () => {
  const router = useRouter();
  //true file
  const [file, setFile] = useState();
  //inital loading state for retrieving user page
  const [loading, setLoading] = useState(true);
  //disables save update button when an update is being proccessed
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  //image url for inital and selected iamges
  const [selectedImage, setSelectedImage] = useState<string>();
  //state of the actual tree which will be displayed in the demo and sent to supabase
  const [page, setPage] = useState<TreeType>();
  //error state for saving update to supabase
  const [error, setError] = useState("");
  //checks that an image exists, probably unneccesary and could be removed
  const [exists, setExists] = useState(false);
  //user id from User response, used in saving image to correct folder
  const [uid, setUID] = useState("");
  //sets the user email, the above should be combined into just one user state
  const [email, setEmail] = useState("");
  //this state controls whether the gridlayout is active, required for it not to but on mobile
  //when typing
  const [isDraggable, setIsDraggable] = useState(true);
  //needs to exist because when a object is moved with react grid layout the only thing that changes is the y value
  //so you have to know the inital order to use the cords i to move the correct link
  const [initLinkOrder, setInitLinkOrder] = useState<LinkType[]>();
  //original state for grid layout cordinates, needs more obvious name
  const [ogState, setOgState] = useState<Cord[]>();
  const context = useAuthContext();
  //The Inital layout or LinkOrder is to bridge the gap between the grid and the demo
  //Using the cordinates for the grid (ogState) it is able to determine how the true order
  //found in the page state should be ordered. For each index of ogState it compares its height cord to
  //see how it has been moved. Using this it rearranges the page order

  //Retrieves inital page layout
  const getUserPage = async () => {
    //gets user from client context
    const user = await context.client!.auth.getUser();

    //retrieves email from response
    let resEmail = user?.data?.user?.email;
    if (!user?.data?.user?.email) {
      router.push("/login");
    }
    //sets email for session
    setEmail(resEmail!);
    setUID(user?.data?.user?.id!);
    //using client context retrieves row associated with email from db
    let { data, error } = await context
      .client!.from("TreePages")
      .select()
      .eq("email", resEmail);
    //Inital page layout
    let page: TreeType = data?.[0];
    setPage(page);
    //setting inital cords
    let links = [...page.links];
    let cords: Cord[] = [];
    //determining inital heights, increments y by 2 for each member
    links.forEach((x, i) => {
      cords.push({ i: `${i}`, x: 0, y: 0 + 2 * i, w: 3, h: 2 });
    });
    //gets pfp for display
    if (page.pfp) {
      let url = context.client?.storage
        .from("tree-pfps")
        .getPublicUrl(page.pfp);
      let edittedPage: TreeType = data?.[0];
      edittedPage.pfp = url?.data.publicUrl!;
      setPage(edittedPage);
      setSelectedImage(url?.data.publicUrl);
      //this was originally for file icon to not display if there's an image,
      //but with the icon it is more clear where to edit image
      setExists(imageExists(url?.data.publicUrl as string) as boolean);
    }
    setInitLinkOrder([...page.links]);
    setOgState(cords);
    setLoading(false);
  };

  //Submission of Changes
  let update = async () => {
    let updateError = "";
    setLoadingUpdate(true);
    //path of uploaded image
    let path;
    if (file) {
      //attempts to upload image
      const { data, error } = await context
        .client!.storage.from("tree-pfps")
        .upload(`${uid}/pfp.png`, file, {
          cacheControl: "1",
          upsert: true,
        });
      path = data?.path;
      if (error) {
        updateError = "An Error Has Occured";
      }
    }
    if (!updateError) {
      //updates db with new details and image path, which should always be the same anyway
      const { data, error } = await context
        .client!.from("TreePages")
        .update({
          name: page?.name,
          url: page?.url,
          links: page?.links,
          pfp: path,
          theme: page?.theme,
        })
        .eq("email", email);
      if (error) updateError = "An Error Has Occured";
      if (error?.code == "23505") {
        //checks the url isnt taken, policy set in supabase so that that can't happen
        updateError = "This URL is already taken, please pick a new one";
      }
    }
    //if there's an error it will display it on the edit screen
    setError(updateError);
    if (!updateError) {
      //sends you back to your page after a successful update
      router.push(`/page/${page?.url}`);
    }
    //loading set to false, will only get here if there was an error
    setLoadingUpdate(false);
  };

  //Basic Title and Url Change
  const handleChange = (type: string, change: string) => {
    let tree = JSON.parse(JSON.stringify(page));
    tree[type] = change;
    setPage({ ...tree });
  };

  //checks which piece was moved then swaps overlapped piece with place of original piece
  const handlePlace = (e: any[]) => {
    //e is an array of gridlayout type cordinates

    //new copy of the original page
    let trueOriginal = [...ogState!];
    //cordinate objects
    let formattedSpots = [];
    let moved;
    //i values in order
    let newOrder = [];
    //finds the piece that was moved
    ogState?.forEach((cord) => {
      e.forEach((newCord) => {
        if (newCord.i == cord.i && newCord.y != cord.y) {
          //the original location of the moved cord and its new spot (y values)
          moved = { original: cord, new: newCord };
        }
      });
    });
    try {
      e.forEach((cord, i) => {
        //if this piece shares a spot with the new location of the moved cord
        //it is moved to the moved cords initial spot
        if (cord.y == moved!.new.y && cord.i != moved!.new.i) {
          let cleaned = { ...cord };
          //swaps out y value
          cleaned.y = moved!.original.y;
          formattedSpots.push(cleaned);
          //setting up the new order of cords
          newOrder.push(cord.i);
        }
        //else if the cord is not sharing a spot and not the moved piece
        else if (cord.i != moved!.new.i) {
          formattedSpots.push(cord);
          newOrder.push(cord.i);
        } else {
          //for the moved piece
          newOrder.push(cord.i);
        }
      });
      formattedSpots.push(moved!.new);
      //setting new original state for cords
      setOgState(formattedSpots);

      //setting the demo to the new placement
      let updatedPage = { ...page };

      let orderedList = [...formattedSpots];
      //actual order links array for tree json
      let orderedLinks: LinkType[] = [];
      //sorts list based on y value or height
      orderedList.sort((a, b) => {
        return a.y - b.y;
      });

      //for each index of ordered list ordered links contains the corresponding cord
      orderedList.forEach((cord, index) => {
        //the ordered list was already put in order of Ys, now the correct link is added to
        //the link list by using the i value as index of the inital link order
        orderedLinks[index] = [...initLinkOrder!][cord.i];
      });
      //updates the page to have the ordered links
      updatedPage.links = orderedLinks;
      setPage(updatedPage as TreeType);
    } catch (error) {
      //if something breaks sets it back
      setOgState(trueOriginal);
    }
  };
  //find the index of the editted link in the page tree
  const getIndex = (id: string) => {
    //finds index that should be editted by comparing heights
    let orderedList = [...ogState!];
    orderedList.sort((a, b) => {
      return a.y - b.y;
    });
    let index = 0;
    //finds the index that matches the id
    orderedList.forEach((item, idx) => {
      if (item.i == id) index = idx;
    });
    return index;
  };

  //edits the links in the page tree
  const editLink = (id: string, type: string, change: string) => {
    //page link array index
    let index = getIndex(id);
    //to edit the links in the inital order array
    // to properly place them in the tree when moving them in handlePlace()
    let edittedInit = [...initLinkOrder!];
    let edittedPage = { ...page };
    let edittedLinks = [...edittedPage.links!];
    if (type == "title") {
      //edits for page and inital tree
      edittedLinks[index].name = change;
      //page update
      edittedPage.links = edittedLinks;
      //inital link order update
      edittedInit[parseInt(id)] = {
        name: edittedLinks[index].name,
        link: edittedLinks[index].link,
      };
    } else if (type == "link") {
      //edits for page and inital tree

      edittedLinks[index].link = change;
      edittedPage.links = edittedLinks;
      edittedInit[parseInt(id)] = {
        name: edittedLinks[index].name,
        link: edittedLinks[index].link,
      };
    }
    //setting new inital link order
    setPage(edittedPage as TreeType);
    setInitLinkOrder(edittedInit);
  };
  //deletes the link
  const deleteLink = (id: string) => {
    //gets page link array index
    let index = getIndex(id);
    let edittedPage = { ...page };
    let edittedLinks = [...edittedPage.links!];
    //removes chosen link
    edittedLinks.splice(index, 1);
    edittedPage.links = edittedLinks;
    let clearedCords = [...ogState!];
    //removes link from gridlayout cords
    clearedCords = clearedCords.filter((cord) => {
      return cord.i != id;
    });
    let newInit = [...initLinkOrder!];
    newInit.splice(parseInt(id), 1);
    //renumbers the ids for gridlayout
    for (let i = 0; i < clearedCords.length; i++) {
      if (parseInt(clearedCords[i].i) > parseInt(id) - 1) {
        clearedCords[i].i = (parseInt(clearedCords[i].i) - 1).toString();
      }
    }
    setInitLinkOrder(newInit);
    setOgState(clearedCords);
    setPage(edittedPage as TreeType);
  };

  //similar to the delete link function, but needs to add cord this time to link page,cords, and inital order
  const addLink = () => {
    let newCords = [...ogState!];
    let newInit = [...initLinkOrder!];
    newInit.push({ link: "", name: "" });
    let length = newCords.length;
    newCords.push({ i: `${length}`, x: 0, y: 0 + 2 * length, w: 3, h: 2 });
    setOgState(newCords);
    setInitLinkOrder(newInit);
    let edittedPage = { ...page };
    edittedPage.links?.push({ link: "", name: "" });
    setPage(edittedPage as TreeType);
  };
  const handleImage = (e: any) => {
    //sets selected file for image upload and demo pic
    setExists(true);
    let edittedPage = { ...page };
    edittedPage.pfp = `${URL.createObjectURL(e)}`;
    setPage(edittedPage as TreeType);
    setFile(e);
    setSelectedImage(`${URL.createObjectURL(e)}`);
  };
  const imageExists = (url: string) => {
    //checks to see if the url for the image path exists, could probably be removed
    if (!loading) {
      try {
        var http = new XMLHttpRequest();
        http.open("HEAD", url, false);
        http.send();
        let res =
          http.status != 304 && http.status != 404 && http.status != 400;
        return res;
      } catch (error) {
        return false;
      }
    }
  };
  const pickColor = (theme: string) => {
    let edittedPage = { ...page };
    //sets page theme in the color picker component
    edittedPage.theme = theme;
    setPage(edittedPage as TreeType);
  };

  //checks for mobile and screen width
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      const updateWindowDimensions = () => {
        const newWidth = window.innerWidth;
        setWidth(newWidth);
      };

      window.addEventListener("resize", updateWindowDimensions);
      updateWindowDimensions();
      return () => window.removeEventListener("resize", updateWindowDimensions);
    } else {
      setWidth(1920);
    }
  }, []);
  //Gets user page on start up
  useEffect(() => {
    getUserPage();
  }, []);
  return (
    <>
      <div
        style={{
          gap: page?.links.length ? "10em" : "30em",

          position: "absolute",
          top: 0,
          left: 0,
          minHeight: "100%",
          gridTemplateColumns:
            width > 800 ? "repeat(7, 1fr)" : "repeat(1, 1fr)",
          maxWidth: width > 800 ? "100%" : width,
        }}
        className={styles.updateDemoContainer}
      >
        <div style={{ zIndex: 15 }} className={styles.updateContainer}>
          <ColorPicker pickColor={pickColor} />
          <div className={styles.updateContainerBackground}></div>
          <div
            style={
              selectedImage
                ? {
                    backgroundImage: `url(${selectedImage})`,
                    marginTop: "1em",
                  }
                : {
                    borderColor: "#E7BB41",
                    marginTop: "1em",
                  }
            }
            className={styles.pfpContainer}
          >
            {selectedImage && !exists && (
              <MdOutlineDriveFolderUpload fontSize="4em" />
            )}
            {}
            <input
              accept="image/png, image/jpeg"
              onChange={(e) => {
                handleImage(e?.target?.files?.[0]);
              }}
              style={{
                position: "absolute",
                opacity: 0,
                backgroundColor: "pink",
                cursor: "pointer",
                height: "10em",
                width: "10em",
              }}
              type="file"
            />
          </div>
          <div
            style={{ paddingTop: "1em" }}
            className={styles["header-input-container"]}
          >
            Name Or Title
            <input
              maxLength={15}
              onChange={(e) => {
                handleChange("name", e.target.value);
              }}
              value={page ? page?.name : ""}
              placeholder="name"
            />
            Url for Your Page
            <input
              pattern="[A-Za-z0-9]{3}"
              value={page ? page?.url : ""}
              maxLength={10}
              onChange={(e) => {
                !e.target.value
                  .split("")
                  .some((r) => ["/", "#", "?"].includes(r)) &&
                  handleChange("url", e.target.value);
              }}
              placeholder="url"
            />
          </div>
          {/* {isDraggable&&"draggable"} */}
          <div>Drag Links to Rearrange</div>
          {!loading && (
            <div
              style={{
                height: `${10 * ogState!.length + 10}em`,
                top: `${-0.8 * ogState!.length + 1.8}em`,
              }}
              className={styles.gridContainer}
            >
              <GridLayout
                isDraggable={isDraggable}
                style={{ top: "-6em", zIndex: 0 }}
                compactType="vertical"
                onDragStart={(e) => setOgState(e)}
                onDragStop={(e) => {
                  handlePlace(e);
                }}
                allowOverlap={false}
                maxRows={ogState!.length * 2}
                onLayoutChange={(e) => {}}
                className={styles["react-grid-layout"]}
                layout={ogState}
                cols={1}
                rowHeight={50}
                width={50}
              >
                {ogState?.map((cord, i) => (
                  <div
                    onTouchStart={(e) => setIsDraggable(true)}
                    key={cord.i}
                    onClick={() => {
                      console.log(i);
                    }}
                    className={styles.linkBox}
                  >
                    {/* uses getIndex to find the location of value */}
                    <div style={{ zIndex: 100 }} className={styles.vStack}>
                      <input
                        id={`${i}title`}
                        onTouchStartCapture={(e) => {
                          setIsDraggable(false);
                        }}
                        onTouchEndCapture={(e) => {
                          setIsDraggable(true);
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        value={page!.links?.[getIndex(cord.i)].name}
                        maxLength={15}
                        onChange={(e) =>
                          editLink(cord.i, "title", e.target.value)
                        }
                        placeholder="Title of Link"
                      />
                      {/* {cord.i} */}
                      <input
                        onTouchStartCapture={(e) => {
                          setIsDraggable(false);
                        }}
                        onTouchEnd={(e) => {
                          setIsDraggable(true);
                        }}
                        id={`${i}link`}
                        onTouchMove={(e) => {
                          e.stopPropagation();
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          document.getElementById(`${i}link`)?.focus();
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        style={{ zIndex: 11110, position: "relative" }}
                        value={page!.links?.[getIndex(cord.i)].link}
                        maxLength={100}
                        onChange={(e) =>
                          editLink(cord.i, "link", e.target.value)
                        }
                        placeholder="URL of your link"
                      />
                    </div>
                    <button
                      onTouchEnd={(e) => {
                        deleteLink(cord.i);
                      }}
                      style={{ zIndex: 10000 }}
                      type="button"
                      onClick={() => {
                        deleteLink(cord.i);
                      }}
                    >
                      <MdDelete fontSize="0.75em" />
                    </button>
                  </div>
                ))}
              </GridLayout>

              {page?.links?.length! < 5 && (
                <button
                  className={styles["add-link-button"]}
                  onClick={() => addLink()}
                >
                  Add a Link
                </button>
              )}
              <button
                disabled={loadingUpdate}
                className={styles.updateButton}
                onClick={() => update()}
              >
                Save Changes
              </button>

             
            </div>
          )}

          <p style={{ color: "red" }}>{error}</p>
        </div>{" "}
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!loading && <Tree demo={page} />}{" "}
        </div>
      </div>
    </>
  );
};

export default UpdateContainer;
