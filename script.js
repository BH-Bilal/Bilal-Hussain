const BLOG_STORAGE_KEY = "bilal_portfolio_blogs";
const SOCIAL_POSITION_KEY = "bilal_social_position";
const CONTACT_EMAIL = "bilalhussain1115@gmail.com";
const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const ADMIN_PASSWORD = "BilalAdmin2026!";
const ADMIN_SESSION_KEY = "bilal_admin_unlocked";

const defaultBlogs = [
  {
    id: "default-mvc",
    tag: ".NET Journey",
    title: "What working with ASP.NET MVC taught me",
    image: "",
    excerpt:
      "From routing to reusable views, MVC helped me understand how to structure web projects in a cleaner and more scalable way.",
    content:
      "From routing to reusable views, MVC helped me understand how to structure web projects in a cleaner and more scalable way.",
    createdAt: "2026-04-06T09:00:00.000Z",
  },
  {
    id: "default-erp",
    tag: "ERP Workflow",
    title: "Understanding inventory flow from GRN to production",
    image: "",
    excerpt:
      "Working with inventory and ERP-related modules showed me how important process clarity is when building software for real operations.",
    content:
      "Working with inventory and ERP-related modules showed me how important process clarity is when building software for real operations.",
    createdAt: "2026-04-06T09:15:00.000Z",
  },
  {
    id: "default-core",
    tag: "Learning",
    title: "Why I am currently focusing on ASP.NET Core",
    image: "",
    excerpt:
      "I am expanding into ASP.NET Core to build more modern web applications while keeping the strong C# foundation that already supports my work.",
    content:
      "I am expanding into ASP.NET Core to build more modern web applications while keeping the strong C# foundation that already supports my work.",
    createdAt: "2026-04-06T09:30:00.000Z",
  },
];

function getSavedBlogs() {
  try {
    const raw = localStorage.getItem(BLOG_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBlogs(blogs) {
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(blogs));
}

function getAllBlogs() {
  const saved = getSavedBlogs();
  return [...saved, ...defaultBlogs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function getBlogById(id) {
  return getAllBlogs().find((blog) => blog.id === id) || null;
}

function formatBlogDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function renderBlogs() {
  const grid = document.getElementById("blogGrid");
  if (!grid) {
    return;
  }

  const blogs = getAllBlogs();
  if (!blogs.length) {
    grid.innerHTML =
      '<div class="blog-empty">No blog posts yet. Use the admin page to publish your first post.</div>';
    return;
  }

  grid.innerHTML = blogs
    .map(
      (blog) => `
        <article class="blog-card">
          ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="blog-card__image" />` : ""}
          <span class="blog-card__tag">${blog.tag}</span>
          <h3 class="blog-card__title">${blog.title}</h3>
          <p class="blog-card__text">${blog.excerpt}</p>
          <div class="blog-card__actions">
            <a class="blog-card__link" href="blog.html?id=${encodeURIComponent(blog.id)}">Read More</a>
            <p class="blog-card__meta">${formatBlogDate(blog.createdAt)}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderBlogPostPage() {
  const container = document.getElementById("blogPost");
  if (!container) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const blogId = params.get("id");
  const blog = blogId ? getBlogById(blogId) : null;

  if (!blog) {
    container.innerHTML = `
      <div class="blog-post__empty">
        <span class="blog-card__tag">Blog</span>
        <h1 class="heading-primary blog-post__title">Post not found</h1>
        <p class="blog-post__content">This blog post could not be found. Go back to the blog list and choose another post.</p>
        <p style="margin-top:2rem;"><a href="index.html#blogs" class="btn btn--med btn--theme">Back To Blogs</a></p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="blog-post__top">
      <span class="blog-card__tag">${blog.tag}</span>
      <a href="index.html#blogs" class="btn btn--med btn--theme-inv">Back To Blogs</a>
    </div>
    ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="blog-post__image" />` : ""}
    <p class="blog-card__meta">${formatBlogDate(blog.createdAt)}</p>
    <h1 class="heading-primary blog-post__title">${blog.title}</h1>
    <div class="blog-post__content">${blog.content}</div>
  `;
}

function renderAdminPosts() {
  const list = document.getElementById("adminBlogList");
  if (!list) {
    return;
  }

  const saved = getSavedBlogs();
  if (!saved.length) {
    list.innerHTML =
      '<div class="admin-empty">No custom posts yet. Publish one and it will appear here and on the homepage.</div>';
    return;
  }

  list.innerHTML = saved
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(
      (blog) => `
        <article class="admin-post-card">
          <div>
            <span class="blog-card__tag">${blog.tag}</span>
            <h3 class="admin-post-card__title">${blog.title}</h3>
            <p class="admin-post-card__text">${blog.excerpt}</p>
            <p class="blog-card__meta">${formatBlogDate(blog.createdAt)}</p>
          </div>
          <button class="admin-post-card__delete" data-delete-blog="${blog.id}" type="button">Delete</button>
        </article>
      `
    )
    .join("");
}

function setupAdminForm() {
  const form = document.getElementById("blogAdminForm");
  if (!form) {
    return;
  }

  renderAdminPosts();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("blogTitle").value.trim();
    const tag = document.getElementById("blogTag").value.trim();
    const image = document.getElementById("blogImage").value.trim();
    const content = document.getElementById("blogContent").value.trim();

    if (!title || !tag || !content) {
      return;
    }

    const blogs = getSavedBlogs();
    const excerpt = content.length > 160 ? `${content.slice(0, 157)}...` : content;

    blogs.unshift({
      id: `blog-${Date.now()}`,
      title,
      tag,
      image,
      content,
      excerpt,
      createdAt: new Date().toISOString(),
    });

    saveBlogs(blogs);
    form.reset();
    renderAdminPosts();

    const status = document.getElementById("adminStatus");
    if (status) {
      status.textContent = "Post published. It will now appear in the Blogs section on the homepage.";
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const blogId = target.getAttribute("data-delete-blog");
    if (!blogId) {
      return;
    }

    const remaining = getSavedBlogs().filter((blog) => blog.id !== blogId);
    saveBlogs(remaining);
    renderAdminPosts();

    const status = document.getElementById("adminStatus");
    if (status) {
      status.textContent = "Post deleted.";
    }
  });
}

function setupAdminGate() {
  const loginSection = document.getElementById("adminLogin");
  const protectedSection = document.getElementById("adminProtected");
  const accessForm = document.getElementById("adminAccessForm");
  const accessStatus = document.getElementById("adminAccessStatus");
  const logoutButton = document.getElementById("adminLogoutBtn");

  if (!loginSection || !protectedSection || !accessForm) {
    return;
  }

  const setUnlocked = (unlocked) => {
    if (unlocked) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      loginSection.hidden = true;
      protectedSection.hidden = false;
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      loginSection.hidden = false;
      protectedSection.hidden = true;
    }
  };

  setUnlocked(sessionStorage.getItem(ADMIN_SESSION_KEY) === "true");

  accessForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const passwordInput = document.getElementById("adminPassword");
    const password = passwordInput instanceof HTMLInputElement ? passwordInput.value : "";

    if (password === ADMIN_PASSWORD) {
      if (accessStatus) {
        accessStatus.textContent = "Access granted.";
      }
      setUnlocked(true);
      accessForm.reset();
      return;
    }

    if (accessStatus) {
      accessStatus.textContent = "Incorrect password.";
    }
  });

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      setUnlocked(false);
      if (accessStatus) {
        accessStatus.textContent = "Admin locked.";
      }
    });
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setupFloatingSocial() {
  const widget = document.getElementById("floatingSocial");
  const handle = document.getElementById("floatingHandle");
  if (!widget || !handle) {
    return;
  }

  const savedPosition = localStorage.getItem(SOCIAL_POSITION_KEY);
  if (savedPosition) {
    try {
      const { left, top } = JSON.parse(savedPosition);
      widget.style.left = `${left}px`;
      widget.style.top = `${top}px`;
      widget.style.right = "auto";
      widget.style.bottom = "auto";
    } catch {
      // ignore invalid saved position
    }
  }

  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;

  function onPointerMove(event) {
    if (!dragging) {
      return;
    }

    const maxLeft = window.innerWidth - widget.offsetWidth - 8;
    const maxTop = window.innerHeight - widget.offsetHeight - 8;
    const nextLeft = clamp(event.clientX - offsetX, 8, Math.max(8, maxLeft));
    const nextTop = clamp(event.clientY - offsetY, 8, Math.max(8, maxTop));

    widget.style.left = `${nextLeft}px`;
    widget.style.top = `${nextTop}px`;
    widget.style.right = "auto";
    widget.style.bottom = "auto";
  }

  function onPointerUp() {
    if (!dragging) {
      return;
    }

    dragging = false;
    widget.classList.remove("dragging");
    localStorage.setItem(
      SOCIAL_POSITION_KEY,
      JSON.stringify({
        left: parseFloat(widget.style.left || "16"),
        top: parseFloat(widget.style.top || "160"),
      })
    );
  }

  handle.addEventListener("pointerdown", (event) => {
    dragging = true;
    widget.classList.add("dragging");
    offsetX = event.clientX - widget.getBoundingClientRect().left;
    offsetY = event.clientY - widget.getBoundingClientRect().top;
    handle.setPointerCapture(event.pointerId);
  });

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("resize", () => onPointerUp());
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactStatus");
  if (!form || !status) {
    return;
  }

  if (!CONTACT_EMAIL) {
    status.textContent =
      "Contact form is ready, but the destination email address still needs to be added.";
  } else {
    status.textContent =
      "Messages are set to send to bilalhussain1115@gmail.com. The first submission may ask you to confirm activation by email.";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const message = document.getElementById("message")?.value.trim() || "";

    if (!name || !email || !message) {
      status.textContent = "Please fill in your name, email, and message.";
      return;
    }

    if (!CONTACT_EMAIL) {
      status.textContent =
        "Add your email address in script.js to activate direct delivery from this form.";
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
    }

    status.textContent = "Sending message...";

    try {
      const formData = new FormData(form);
      formData.set("name", name);
      formData.set("email", email);
      formData.set("message", message);
      formData.set("_subject", `Portfolio message from ${name}`);
      formData.set("_template", "table");
      formData.set("_captcha", "true");

      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || "Unable to send message right now.");
      }

      form.reset();
      status.textContent =
        "Message sent successfully. Please check your email if FormSubmit asks you to confirm the form the first time.";
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : "Unable to send message right now.";
      status.textContent = `${messageText} If you're testing this from a local file, try again after deploying or serving the site through a local web server.`;
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
      }
    }
  });
}

renderBlogs();
renderBlogPostPage();
setupAdminGate();
setupAdminForm();
setupFloatingSocial();
setupContactForm();
