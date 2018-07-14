/**
 * assets/portfolio.js
 *
 * Simple templating engine to populate
 * project portfolio.
 *
 * Will Badart
 * created: APR 2017
 */

(function(global){
// Disabled for assigning to innerHTML
// 'use strict';

var PROJECTS  = [];
global.onload = get_projects;

/**
 * function render_projects(frame: String) -> function() -> undefined
 * Generate project nodes and render them to the given frame
 */
function render_projects(frame){
    frame = document.getElementById(frame);
    return function(){
        frame.removeChild(document.getElementById('loading'));
        PROJECTS.map(to_proj_node).forEach(frame.appendChild.bind(frame));
    }
}

/**
 * function get_projects -> undefined
 * Fetch project list and call renderer
 */
function get_projects(){
    var req = new XMLHttpRequest();
    req.onload = function(){
        PROJECTS = JSON.parse(this.responseText);
        render_projects('projects-frame')();
    };
    req.open('GET', '/assets/projects.json');
    req.send();
}

/**
 * function to_proj_node(p: Object) -> undefined
 * Transform a project Object into a DOM element
 */
function to_proj_node(p){

    var root        = document.createElement('div')
      , proj_header = document.createElement('div')
      , proj_body   = document.createElement('div')
      , proj_link   = document.createElement('div')
    ;

    /**
     * div.proj
     *   div.proj-header
     *     h3
     *   div.proj-body
     *     div.img-frame > img
     *     p[description]
     *   div.proj-link > p
     */

    root.classList.add('proj');
    proj_header.classList.add('proj-header');
    proj_body.classList.add('proj-body');
    proj_link.classList.add('proj-link');

    //=================
    // div.proj-header
    //=================

    var title = document.createElement('h3');
    title.innerHTML = p.title;
    proj_header.appendChild(title);

    //===============
    // div.proj-body
    //===============

    var img       = document.createElement('img')
      , img_frame = document.createElement('div');
    img.src = p.img.src; img.alt = p.img.alt;
    img_frame.classList.add('img-frame');
    img_frame.appendChild(img);
    proj_body.appendChild(img_frame);

    var desc = document.createElement('p');
    desc.innerHTML = p.description;
    proj_body.appendChild(desc);

    //==============
    // div.proj_link
    //==============

    var link = document.createElement('p');

    if(p.link){
        var a = document.createElement('a')
          , i = document.createElement('i')
          , t = document.createTextNode(
                    p.link.replace(/(https?:\/\/|:\d+|\/index\.html?$|\/$|)/ig, ''));
        i.classList.add('fa'); i.classList.add('fa-external-link');
        a.href = p.link; a.target = '_blank';
        a.appendChild(i); a.appendChild(t);
        link.appendChild(a);
    } else link.innerHTML = 'Not yet live';

    proj_link.appendChild(link);

    //=====================
    // Put it all together
    //=====================

    root.appendChild(proj_header);
    root.appendChild(proj_body);
    root.appendChild(proj_link);

    return root;
}


})(window);

