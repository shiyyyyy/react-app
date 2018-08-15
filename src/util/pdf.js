import {log} from './core';
import {error} from './com';


let pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdf.worker.js';
let pdfLoadingTask;
let pdfDoc;
let pdfCanvas;
let pdfCtWidth;
let pdfCanvasCxt;
let pdfRendering;
let scaleMin;
let scaleMax=4;
let pdfScale;
let pageNum=1;

function renderInit(cb) {
    pdfDoc.getPage(pageNum).then(
        page=>{

        	pdfRendering = true;
            scaleMin = 1;
            let viewport = page.getViewport(1);

            if(pdfCtWidth<viewport.width){
                scaleMin = pdfCtWidth / viewport.width;
                viewport = page.getViewport(scaleMin);
            }  

            pdfScale = scaleMin;
            pdfCanvas.height = viewport.height;
            pdfCanvas.width = viewport.width;

            let renderContext = {
              canvasContext: pdfCanvasCxt,
              viewport: viewport
            };
            page.render(renderContext).then(
                r=>{
                    pdfRendering=false;
                    cb && cb(pdfDoc.numPages);
                }
            );
        }
    );

}

function _loadPdf(url,canvas,width,cb) {

    pdfLoadingTask = pdfjsLib.getDocument(url);
    pdfLoadingTask.promise.then(
        r=>{
            pdfDoc=r;
            pdfCanvas=canvas;
            pdfCanvasCxt=canvas.getContext('2d');
            pdfCtWidth=width;
            renderInit(cb);
        },
        e=>{
            log(e);
            error('文档加载失败');
        }
    );
}
export function loadPdf(url,canvas,width,cb) {
    if (pdfLoadingTask) {
        pdfLoadingTask.destroy().then(_=>{
            pdfLoadingTask = null;
            pdfDoc = null;
            pageNum = 1;
            pdfRendering = false;
            _loadPdf(url,canvas,width,cb);
        });
    }else{
        _loadPdf(url,canvas,width,cb);
    }
}
export function renderPage() {
    if(pdfRendering){
        return;
    }

    pdfDoc.getPage(pageNum).then(
    	page=>{
	    	pdfRendering = true;
		    let viewport = page.getViewport(pdfScale);
		    pdfCanvas.height = viewport.height;
		    pdfCanvas.width = viewport.width;

		    let renderContext = {
		      canvasContext: pdfCanvasCxt,
		      viewport: viewport
		    };
	        page.render(renderContext).then(r=>pdfRendering=false);
	    }
    );
}
export function zoomIn() {
    if(pdfScale > scaleMax){
    	return 'stop';
    }
    pdfScale += 0.5;
    renderPage();
}
export function zoomOut() {
    if(pdfScale < scaleMin+0.1){
    	return 'stop';
    }
    pdfScale -= 0.5;
    renderPage();
}
export function prePage() {
	if(pageNum <= 1){
		return pageNum;
	}
    pageNum--;
    renderPage();
    return pageNum;
}
export function nextPage() {
	if(pageNum >= pdfDoc.numPages){
		return pageNum;
	}
    pageNum++;
    renderPage();
    return pageNum;
}