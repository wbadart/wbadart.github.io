---
title: "Git Gud"
date: 2020-05-13T21:28:48-07:00
outputs:
- reveal
summary: >
  These slides originally accompanied a talk I gave to _Cakes and Tensors_, a
  data science community of interest at Booz Allen. _Git Gud_ surveys git and a
  couple other tools that help track data science work. I wrote a [blog
  post](/posts/git-gud) that roughly corresponds to the talk track.
---

{{% section %}}

# Git Gud

_May 14, 2020_

Will Badart

<small><Badart_William@bah.com></small>

{{% /section %}}

---

{{% section %}}

# Why should I git gud?

---

## Credibility

- Improve **explainability** with the ability to trace the evolution of your
  model all the way back to day one
- Using established change management techniques demonstrates process maturity

---

## Collaboration

- Automatically reconcile changes from many contributors
- Improve **replicability** by delivering a code with a common, open mechanism

---

## Sanity

- Stakeholders aren't the only ones benefiting from a written history...
- Never again wonder: "how the hell did I get here?"

{{% /section %}}

---

{{% section %}}

# How do I git gud?

---

## Learn the tool

- [Git - The Simple Guide](https://rogerdudler.github.io/git-guide)
- [Learn Git Branching](https://learngitbranching.js.org)

---

## In short...

- **Record incremental changes to the project in git _commits_**

---

## For example

```diff
commit 990e1d429680297fd2c1c44cf17c82a4254d200e
Author: Will Badart <badart_william@bah.com>
Date:   Wed May 13 19:33:23 2020 -0700

    Add shuffling to preprocessing pipeline
    
    My advanced solution helps prevent overfitting by
    randomizing the dataset each run, before
    partitioning it.

diff --git a/preprocess.py b/preprocess.py
index 7fc7534..a157c89 100644
--- a/preprocess.py
+++ b/preprocess.py
@@ -1,10 +1,12 @@
 import pandas as pd
 from sklearn.model_selection import train_test_split
 from sklearn.preprocessing import MinMaxScaler
+from sklearn.utils import shuffle
 
 
 def preprocess(df):
     """Apply my fancy pipeline to the DataFrame."""
+    df = shuffle(df)
     y = df.pop("label")
     X = df.values
     scaler = MinMaxScaler()
```

---

Commits can be read _and_ manipulated

---

## In short...

- Record incremental changes to the project in git _commits_
- **Organize work with git _branches_**

---

## For example

![Git branches](/img/git-gud/branches.png)

---

## Further reading

- [GitHub Flow](https://guides.github.com/introduction/flow)
- [githowto](https://githowto.com)
- Another [git cheat
  sheet](https://github.github.com/training-kit/downloads/github-git-cheat-sheet)

{{% /section %}}

---

{{% section %}}

# Tracking Data Science Projects

---

## Challenges

- Working with more than just code (data, notebooks, environment...)
- Rapid iteration/ trial and error yields high volume of changes

{{% /section %}}

---

{{% section %}}


# More than just code: _data_

---

## The Challenge

- You _could_ track your data files with git
- Git scales surprisingly well to huge files...
- ... but you're doing more work than you need to
- It's much easier to track a _recipe_ for getting the data than to track the
  data itself
  
---

## Good

Add `get_data.sh` to your project:

```sh
mkdir -p data/raw
wget -O data/raw/initial_dataset.csv
chmod -w data/raw/*  # important! prevent squashing raw data
```

---

## Better

Record data dependencies with a Makefile:

```make
data/raw/initial_dataset.csv: data/raw
    wget -O data/raw/initial_dataset.csv
    chmod -w data/raw/*
    
data/raw:
    mkdir -p data/raw
```

[_Data is immutable and analysis is a
DAG_](https://drivendata.github.io/cookiecutter-data-science)


{{% /section %}}

---

{{% section %}}


# More than just code: _notebooks_

---

## The challenge

- Notebooks contain much of our day-to-day work and experimentation, so their
  content must be tracked somehow...
- ... but `.ipynb` files are big blobs of JSON under the hood which don't play
  nice with git
  
---

## Good

Use [nbdime](https://nbdime.readthedocs.io/en/latest) to view and manage
notebook changes

---

Here's a regular diff from adding just one cell to a notebook

```diff
diff --git a/Hello World.ipynb b/Hello World.ipynb
index 7fec515..6cd9078 100644
--- a/Hello World.ipynb	
+++ b/Hello World.ipynb	
@@ -1,6 +1,49 @@
 {
- "cells": [],
- "metadata": {},
+ "cells": [
+  {
+   "cell_type": "code",
+   "execution_count": 1,
+   "metadata": {},
+   "outputs": [
+    {
+     "name": "stdout",
+     "output_type": "stream",
+     "text": [
+      "Hello world!\n"
+     ]
+    }
+   ],
+   "source": [
+    "print(\"Hello world!\")"
+   ]
+  },
+  {
+   "cell_type": "code",
+   "execution_count": null,
+   "metadata": {},
+   "outputs": [],
+   "source": []
+  }
+ ],
+ "metadata": {
+  "kernelspec": {
+   "display_name": "Python 3",
+   "language": "python",
+   "name": "python3"
+  },
+  "language_info": {
+   "codemirror_mode": {
+    "name": "ipython",
+    "version": 3
+   },
+   "file_extension": ".py",
+   "mimetype": "text/x-python",
+   "name": "python",
+   "nbconvert_exporter": "python",
+   "pygments_lexer": "ipython3",
+   "version": "3.8.2"
+  }
+ },
  "nbformat": 4,
  "nbformat_minor": 4
 }
```

---

And here's how it looks with nbdime's `nbdiff-web`

![nbdiff-web](/img/git-gud/nbdiff-web.png)

---

## Better

- nbdime is a great tool, but it's a band-aid
- Jupyter Notebook is a literate programming tool, not an IDE
- A notebook isn't a module; it imports a module and communicates the results
  of its use through visualization and prose
- So move the heavy lifting into a proper Python module (known more commonly as
  a `.py` file)
  
---

It says so right on the tin:

> The Jupyter Notebook is an open-source web application that allows you to
create and share documents that contain live code, equations, visualizations
and narrative text.
> 
> &mdash; jupyter.org

A `.ipynb` file isn't so much a program to be run by a machine as it is a
report to be read by a human

---

## With your code in a module

- It's no longer frozen in your input cells; you can import it from anywhere,
  including your notebook
- You can load it into a proper **test suite** (big credibility points!)
- You can load it **into another project** (it's getting DRY in here!)
- In short, you unlock all the software engineering goodies unavailable to
  notebook code
  
---

## Pro Tip

Add this cell to your notebook, before your imports

```python
%load_ext autoreload
%autoreload 2
```

Now import you library code

```python
from my_project_lib import *
```

<small>
<ul>
<li>
As you work on <code>my_project_lib.py</code>, the
notebook will automatically use those changes, as though the code were written
directly in the notebook
</li>
<li>
Have your cake and eat it too :)
</li>
</ul>
</small>

{{% /section %}}

---

{{% section %}}

## Why can't I track all these changes??

![why can't i...](/img/git-gud/limes_guy.jpg)

---

## The challenge

- One of our most important jobs is trying different combinations of
  algorithms, architectures, and parameters to see which gives the best
  performance...
- ... but this is a huge space of models which would be prohibitively tedious
  to track one at a time with individual commits
  
---

Recognize that each tweak/ re-run cycle is a **trial** in a greater experiment
  
---

## Good

Track each trial in a commit anyway

- After tweaking and re-running the notebook, commit the changes to it
- Write a message about what you tried, why you tried it, and what happened

---

## Better

Track experiments with MLflow

![mlflow](https://mlflow.org/images/MLflow-logo-final-white-TM.png)

---

## Easy money

1. Install

```sh
pip install mlflow
```

2. Sprinkle in some tracking

```python
import mlflow
# ...
NUM_EPOCHS = 7500
mlflow.log_parameter("NUM_EPOCHS", NUM_EPOCHS)
# ...
for epoch in range(NUM_EPOCHS):
    # ...
    training_accuracy = accuracy_score(y_test, y_pred)
    mlflow.log_metric("TRAINING_ACCURACY", training_accuracy)
```

3. ...

---

## Profit

```sh
mlflow ui
```

![mlflow ui](/img/git-gud/mlflow-web-ui.png)

<small>Image via <a
href="https://databricks.com/blog/2018/06/05/introducing-mlflow-an-open-source-machine-learning-platform.html">DataBricks</a></small>

{{% /section %}}

---

{{% section %}}

# More than just code: _environment_

---

Your results are more than the sum of their source code. They are equally (and
implicitly) dependent on your compute environment.

---

## The challenge

- Reproducing results is predicated on reproducing all experimental
  conditions...
- ... but unlike the raw text of a source file, "environment" is a rather
  abstract thing
  - the libraries used, their versions, your Python installation, the state of
    the file system, etc.

---

## Good

Maintain a requirements file

---

## Pros

- Popular, conventional solution
- Ability to "freeze" all package versions (including transitive dependencies)
  ```sh
  pip freeze > requirements.txt
  ```
Good for reproducibility!

---

## Cons

- Mixing of transitive dependencies makes it impossible to answer "what
  packages does _my_ project use?"
- Dated tooling

---

## Better

Use [Poetry](https://python-poetry.org/)

![python poetry](/img/git-gud/poetry.png)

---

## Pros

- They have a pretty website so you know they're legit
- Gives a more complete and detailed image of project's dependencies

![poetry dependencies](/img/git-gud/poetry-tree.png)

---

## Pros (ctd.)

- Makes project isolation/ virtual environment management easier
- Demystifies the `setuptools` arcana of packaging a project
- Compatible with the new
  [`pyproject.toml`](https://www.python.org/dev/peps/pep-0518/) standard
  
---

## Even better

Write a Dockerfile and build a container

---

Long story short, the better your experimental isolation, the more reproducible
your results will be. Ergo, **better science**.

---

A **container** is like a diet VM that creates a (for all intents and
purposes) totally isolated environment where you can run your experiment.

A Dockerfile, which describes a container, is an extremely lightweight way to
share that exact environment with others.

---

## Easy money

1. Add `Dockerfile` to your project

```dockerfile
FROM python:3.7
WORKDIR /src
COPY . .
RUN pip install -r requirements.txt notebook
CMD jupyter notebook --allow-root
```

2. Build the image

```sh
docker build -t my_awesome_model .
```

3. ...

---

## That's right, Profit

Spin up a container to run your notebook

```sh
docker run -it -p 8888:8888 my_awesome_model
```

<small>
<ul>
<li>
  Your notebook is now running at <code>localhost:8888</code> just like normal
</li>
<li>
  Except as far as it can tell, it's running in the barebones Ubuntu
  environment specified by the Dockerfile; the same environment it would see
  when run via Docker on anyone else's machine
</li>
</ul>
</small>

---

![wait](/img/git-gud/but-wait.jpg)

---

# Your project is now cloud-ready

---

With a Docker image capable of running your project, you're now one `docker
push` away* from, say, uploading your model to an AWS container registry where
it can be picked up and run by Fargate

<br>
<small>* some assembly required</small>

{{% /section %}}

---

{{% section %}}

# What do I do, now that I got gud?

---

## Whatever you want!

<small>
By learning git, you've unlocked a new universe of potential for you project
</small>

- Implement a branching workflow with your team to tighten up release cycles
- Leverage Docker to run your project anywhere; train in the cloud and make an
  inference engine out of an on-prem Kubernetes cluster
- Take advantage of git services and integrations; have Jenkins retrain your
  model every Saturday, and host your documentation on GitHub Pages (like this
  deck!)
  
---

## Keep learning

- Do [Git Kata](https://github.com/praqma-training/git-katas)
- Read the [GitHub Guides](https://guides.github.com)
- While you're at it, read the [Open Source Guides](https://opensource.guide)
- Read more of my opinions [here][how i do] and [here][step after]

[how i do]: https://blog.willbadart.com/2019/05/19/how-i-do-an-analysis.html
[step after]: https://willbadart.com/posts/notebook-driven-ds

{{% /section %}}

---

{{% section %}}

# Thanks!

{{% /section %}}
