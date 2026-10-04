import User from "../model/User.js";
import cloudinary from "../lib/cloudinary.js";
import Message from "../model/message.js";

export const getAllcontacts = async (req, res) => {
  try {
    const myId = req.user._id;

    const allContacts = await User.find({ _id: { $ne: myId } }).select(
      "-password",
    );

    return res.status(200).json(allContacts);
  } catch (error) {
    return res.status(500).json({ message: "Internel server Error" });
  }
};

export const getMessageById = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: reciver } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, reciverId: reciver },
        { senderId: reciver, reciverId: myId },
      ],
    });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: "Internel Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const sender = req.user._id;
    const { id: reciver } = req.params;

    let uploadImageUrl;
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      uploadImageUrl = uploadedResponse.secure_url;
    }
    const newMessage = new Message({
      senderId: sender,
      reciverId: reciver,
      text: text,
      imageUrl: uploadImageUrl,
    });

    await newMessage.save();
    return res.status(201).json({ newMessage });
  } catch (error) {
    return res.status(500).json({ message: "Internel server Error" });
  }
};

export const chatPartners = async (req, res) => {
  try {
    const loggedUser = req.user._id;

    const message = await Message.find({
      $or: [{ senderId: loggedUser }, { reciverId: loggedUser }],
    });

    const chatPartnersId = [
      ...new Set(
        message.map((msg) =>
          message.senderId.toString() === loggedUser.toString()
            ? reciverId.toString()
            : senderId.toString(),
        ),
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: { chatPartnersId } },
    }).select("-password");

    return res.status(200).json(chatPartners)
  } catch (error) {
    res.status(500).json({ message: "Internsl Server Error" });
  }
};
