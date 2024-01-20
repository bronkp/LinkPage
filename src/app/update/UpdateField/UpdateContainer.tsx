import React, { useState } from "react";
import { useAuthContext } from "../../../../context/AuthContext";
import styles from "@/app/page.module.css";
import { useEffect } from "react";
import { ColorPallet, Cord, LinkType, TreeType } from "../../../../types/types";
import Tree from "../../../../components/Tree";
import GridLayout from "react-grid-layout";
import { MdDelete, MdOutlineDriveFolderUpload } from "react-icons/md";
import { useRouter } from "next/navigation";
import ColorPicker from "./ColorPicker";

const UpdateContainer = () => {
  const router = useRouter();
  //true file
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  //image url for inital and selected iamges
  const [selectedImage, setSelectedImage] = useState<string>();
  const [page, setPage] = useState<TreeType>();
  const [error, setError] = useState("");
  const [exists,setExists]=useState(false)
  const [uid, setUID] = useState("");
  const [email, setEmail] = useState("");
  const [isDraggable,setIsDraggable] = useState(true)
  const [initLinkOrder, setInitLinkOrder] = useState<LinkType[]>();
  // const [overlap, setOverlap] = useState(true);
  const [ogState, setOgState] = useState<Cord[]>();
  //const [compactType, setCompactType] = useState("vertical");
  const context = useAuthContext();
  //The Inital layout or LinkOrder is to bridge the gap between the grid and the demo
  //Using the cordinates for the grid (ogState) it is able to determine how the true order
  //found in the page state should be ordered. For each index of ogState it compares its height cord to
  //see how it has been moved. Using this it rearranges the page order

  //Submission of Changes

  let update = async () => {
    let updateError = "";
    setLoadingUpdate(true);
    let path;
    if (file) {
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
      const { data, error } = await context
        .client!.from("TreePages")
        .update({
          name: page?.name,
          url: page?.url,
          links: page?.links,
          pfp: path,
          theme:page?.theme,
        })
        .eq("email", email);
      if (error) updateError = "An Error Has Occured";
      //@ts-ignore
      //console.log(error);
      if (error?.code == "23505") {
        updateError = "This URL is already taken, please pick a new one";
      }
    }
    setError(updateError);
    if (!updateError) {
      router.push(`/page/${page?.url}`);
    }
    setLoadingUpdate(false);
  };

  //Basic Title and Url Change
  const handleChange = (type: string, change: string) => {
    let tree = JSON.parse(JSON.stringify(page));
    tree[type] = change;
    setPage({ ...tree });
  };

  //Retrieves inital page layout
  const getUserPage = async () => {
    //gets user from client context
    
    const user = await context.client!.auth.getUser();
    //retrieves email from response
    let resEmail = user?.data?.user?.email;
    if(!user?.data?.user?.email){
      router.push("/login")
    }
    //sets email for session
    setEmail(resEmail!);
    setUID(user?.data?.user?.id!);
    //using client context retrieves row associated with email from db
    let { data, error } = await context
      .client!.from("TreePages")
      .select()
      .eq("email", resEmail);
      console.log(data,error,resEmail)
    //Inital page layour
    let page: TreeType = data?.[0];
    setPage(page);
    //setting inital cords
    let links = [...page.links];
    let cords: Cord[] = [];
    //determining inital heights
    links.forEach((x, i) => {
      cords.push({ i: `${i}`, x: 0, y: 0 + 2 * i, w: 3, h: 2 });
    });
    //gets pfp for display
    if (page.pfp) {
      let url = context.client?.storage
        .from("tree-pfps")
        .getPublicUrl(page.pfp);
      console.log("url", url);
      let edittedPage: TreeType = data?.[0];
      edittedPage.pfp = url?.data.publicUrl!;
      setPage(edittedPage);
      setSelectedImage(url?.data.publicUrl);
      setExists(imageExists(url?.data.publicUrl as string) as boolean)
      console.log(edittedPage,"here")
    }
    setInitLinkOrder([...page.links]);
    setOgState(cords);
    setLoading(false);
  };

  //checks which piece was moved then swaps overlapped piece with place of original piece
  const handlePlace = (e: any[]) => {
    //new copy of the original page
    let trueOriginal = [...ogState!];
    let formattedSpots = [];
    let moved;
    let newOrder = [];
    //finds the piece that was moved
    ogState?.forEach((cord) => {
      e.forEach((newCord) => {
        if (newCord.i == cord.i && newCord.y != cord.y) {
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
      //may be unneeded
      //setOverlap(false);
      //setting the demo to the new placement
      let updatedPage = { ...page };
      let orderedList = [...formattedSpots];
      let orderedLinks: LinkType[] = [];
      //sorts list based on y value or height
      orderedList.sort((a, b) => {
        return a.y - b.y;
      });

      //for each index of ordered list ordered links contains the corresponding cord
      orderedList.forEach((cord, index) => {
        //flag
        orderedLinks[index] = [...initLinkOrder!][cord.i];
      });
      //updates the page to have the ordered links
      updatedPage.links = orderedLinks;
      setPage(updatedPage as TreeType);
    } catch (error) {
      setOgState(trueOriginal);
      //setOverlap(false);
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
    let index = getIndex(id);
    let edittedInit = [...initLinkOrder!];
    let edittedPage = { ...page };
    let edittedLinks = [...edittedPage.links!];
    if (type == "title") {
      //edits for page and inital tree
      edittedLinks[index].name = change;
      edittedPage.links = edittedLinks;
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
    let index = getIndex(id);
    let edittedPage = { ...page };
    let edittedLinks = [...edittedPage.links!];
    edittedLinks.splice(index, 1);
    edittedPage.links = edittedLinks;
    let clearedCords = [...ogState!];
    clearedCords = clearedCords.filter((cord) => {
      return cord.i != id;
    });
    let newInit = [...initLinkOrder!];
    newInit.splice(parseInt(id), 1);

    for (let i = 0; i < clearedCords.length; i++) {
      if (parseInt(clearedCords[i].i) > parseInt(id) - 1) {
        clearedCords[i].i = (parseInt(clearedCords[i].i) - 1).toString();
      }
    }
    setInitLinkOrder(newInit);
    setOgState(clearedCords);
    setPage(edittedPage as TreeType);
  };
  const addLink = () => {
    let newCords = [...ogState!];
    let newInit = [...initLinkOrder!];
    newInit.push({ link: "", name: "" });
    let length = newCords.length;
    newCords.push({ i: `${length}`, x: 0, y: 0 + 2 * length, w: 3, h: 2 ,});
    setOgState(newCords);
    setInitLinkOrder(newInit);
    let edittedPage = { ...page };
    edittedPage.links?.push({ link: "", name: "" });
    setPage(edittedPage as TreeType);
  };
  const handleImage = (e:any) => {
    setExists(true)
    let edittedPage = { ...page };
    edittedPage.pfp = `${URL.createObjectURL(e)}`;
    setPage(edittedPage as TreeType);
    setFile(e);
    setSelectedImage(`${URL.createObjectURL(e)}`);
  };
  const imageExists=(url:string)=>{
    if(!loading){
    try {
      var http = new XMLHttpRequest();
      http.open('HEAD', url, false);
      http.send();
      let res = http.status != 304&&http.status!= 404&&http.status!=400
      return res
    } catch (error) {
      return false
    }}
  }
  const pickColor = (theme:string)=>{
    let edittedPage = {...page}
    edittedPage.theme=theme
    setPage(edittedPage as TreeType)
  }
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){

    const updateWindowDimensions = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      console.log("updating Width");
    };

    window.addEventListener("resize", updateWindowDimensions);
    updateWindowDimensions()
    return () => window.removeEventListener("resize", updateWindowDimensions) }else{
      setWidth(1920)
    }

  }, []);
  useEffect(() => {
    getUserPage();
  }, []);
  return (
    <>
      <div style={{
  gap:page?.links.length?"10em":"30em",

        position:"absolute",top:0,left:0, minHeight:"100%",
  gridTemplateColumns:width>800? "repeat(7, 1fr)":"repeat(1, 1fr)",
        maxWidth:width>800?"100%":width,
        }} className={styles.updateDemoContainer}>
        <div style={{zIndex:15}} className={styles.updateContainer}>
          <ColorPicker pickColor={pickColor}/>
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
            {selectedImage&&!exists && <MdOutlineDriveFolderUpload fontSize="4em" />}{}
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
              value={page ? page?.url : ""}
              maxLength={10}
              onChange={(e) => {
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
                style={{ top: "-6em",zIndex:0 }}
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
                  onTouchStart={(e)=>setIsDraggable(true)}
                    key={cord.i}
                    onClick={() => {
                      console.log(i);
                    }}
                    className={styles.linkBox}
                  >
                    {/* uses getIndex to find the location of value */}
                    <div style={{zIndex:100}} className={styles.vStack}>
                      <input
                       id={`${i}title`}
                     
                      onTouchStartCapture={(e)=>{
                        setIsDraggable(false)

                      }}
                      onTouchEndCapture={(e)=>{
                        setIsDraggable(true)
                      }}
                        onMouseDown={(e) => {
                          e.stopPropagation()
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
                      
                      onTouchStartCapture={(e)=>{
                        setIsDraggable(false)

                      }}
                      onTouchEnd={(e)=>{
                        setIsDraggable(true)
                      }}
                       id={`${i}link`}
                       onTouchMove={(e)=>{e.stopPropagation();}}
                       onTouchStart={(e)=>{
                         e.stopPropagation();
                         document.getElementById(`${i}link`)?.focus()

                       }}
                       onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                      style={{zIndex:11110,position: "relative"}}
                        value={page!.links?.[getIndex(cord.i)].link}
                        maxLength={100}
                        onChange={(e) =>
                          editLink(cord.i, "link", e.target.value)
                        }
                        placeholder="URL of your link"
                      />
                    </div>
                    <button
                    onTouchEnd={(e)=>{

                      deleteLink(cord.i);
                      
                    }}
                    style={{zIndex:10000}}
                    type="button"
                      onClick={() => {
                        deleteLink(cord.i);
                      }}
                    >
                      <MdDelete  fontSize="0.75em"/>
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

              {/* <button
                onClick={() =>
                  console.log(
                    "Cords",
                    ogState,
                    "Inital State",
                    initLinkOrder,
                    "Page Links",
                    page?.links
                  )
                }
              >
                Debug
              </button> */}
            </div>
          )}

          <p style={{ color: "red" }}>{error}</p>
        </div>{" "}
        <div style={{height:"100%",display:"flex", justifyContent:"center",alignItems:"center"}}>

        {!loading && <Tree demo={page} />}{" "}
        </div>
      </div>
    </>
  );
};

export default UpdateContainer;
