// Illustrative stock, not photographs of Yellostack staff or delivered projects.
export const stockMedia={
 collaboration:{src:'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1400',alt:'A team collaborating around a table',source:'https://www.pexels.com/photo/photo-of-people-doing-handshakes-3183197/'},
 engineering:{src:'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1400',alt:'Developers reviewing code together',source:'https://www.pexels.com/photo/two-women-looking-at-the-code-at-laptop-1181263/'},
 cloud:{src:'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=1400',alt:'Engineer working beside server infrastructure',source:'https://www.pexels.com/photo/software-engineer-standing-beside-server-racks-1181354/'},
 design:{src:'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=1400',alt:'Planning a product on a whiteboard',source:'https://www.pexels.com/photo/woman-wearing-gray-blazer-writing-on-dry-erase-board-1181534/'},
};
export function pageMedia(slug:string){
 if(/cloud|erp|dynamic|facilit/.test(slug))return stockMedia.cloud;
 if(/design|branding|marketing|search/.test(slug))return stockMedia.design;
 if(/app|software|intelligence|medical|ecommerce|sharepoint/.test(slug))return stockMedia.engineering;
 return stockMedia.collaboration;
}
export const studioFilm={src:'https://videos.pexels.com/video-files/3254071/3254071-uhd_3840_2160_25fps.mp4',source:'https://www.pexels.com/video/a-person-s-hand-typing-on-a-computer-keyboard-3254071/'};
