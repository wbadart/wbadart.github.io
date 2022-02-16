---
title: The Step After Notebooks
date: 2020-03-19T16:35:07-07:00
---

The quality of an analysis is measured by _impact_. Analytics exists to solve
client problems, and with the volume of client data continuing to explode, data
science represents a vital opportunity for impact. People realize this: [IBM
forecasts][ibm] that there will be almost 3,000,000 data science jobs by the
end of this year.

[ibm]: https://www.forbes.com/sites/louiscolumbus/2017/05/13/ibm-predicts-demand-for-data-scientists-will-soar-28-by-2020/#3f066a157e3b 

Unfortunately, data science is a complex domain, and what I'll call
_notebook-driven development_, the popular technique of conducting an analysis
primarily in Jupyter notebooks, does little to manage that complexity. This
makes it difficult (at best!) for an analysis to be maximally impactful out of
the box. Luckily, at the end of the day, data science _is made out of
software_, and for decades, software engineers have studied how to manage
complexity. Let's leverage these years of progress and explore how a little
software engineering discipline can multiply our data science impact.

## Impact Multiplier #1: Abstraction

Abstraction creates power and power enables impact.

An abstraction encapsulates the details of a pattern, letting us state our
intention concisely and move on to the next thing quickly.  It's also easier to
communicate (both to teammates and to clients) with a good abstraction, rather
than laying bare all the minutiae.  For example, PyTorch's `nn.Linear` class
abstracts over the matrix algebra involved in a fully connected neural network
layer. This expressive power saves us the tedium of managing the layer's
weights and biases and lets us communicate the layer's role concisely.

An abstraction must be portable to be impactful; we should be able to exploit
it wherever we find the pattern it encapsulates. This is the first axis on
which notebook-driven development inhibits abstraction: once code is written in
a notebook, the only way to use it is to run the notebook and read the output.
This is by design. Jupyter, in spite of appearances, isn't really an IDE, but a
literate programming tool:

> The Jupyter Notebook is an open-source web application that allows you to
> create and share _documents_ that contain live code, equations,
> visualizations and narrative text.
>
> &mdash; [jupyter.org](https://jupyter.org) (emphasis added)

An `ipynb` file isn't so much a program to be run by a machine as it is a
report to be read by a human. The notebook should import -- not implement -- a
library and communicate the results of its use through visualization and prose.

This leads us to our first concrete recommendation: **implement core code as
functions in a library** (in `.py` files).  Now, what used to be anonymous
blocks of code stuck inside our input cells are named functions which can be
exported, tested, and reused for great fortune and impact. Use the
[`%autoreload` magic][autoreload] to facilitate the concurrent development of
notebooks and libraries.  Also note that it's much easier to _version control_
a `.py` file than a notebook (which is just a blob of JSON under the hood).  In
the face of changing requirements, using Git to manage the evolution of your
analysis will enable collaboration and help you _continue_ to make an impact.

[autoreload]: https://ipython.org/ipython-doc/3/config/extensions/autoreload.html

This organization makes the abstractions we develop over the course of the
project portable; we're one `setup.py` file away from being able to `pip
install` this work to another project. This reuse saves us critical time and
effort, and lets us focus on the unique challenges of that new project.

## Impact Multiplier #2: Composition

Good abstractions enhance impact by making the most of patterns, and principled
composition enhances impact by making the most of abstractions. Software
engineering is digital alchemy, nothing more or less than a cycle of problem
decomposition and solution (or abstraction) composition. That is to say, when
we write code, we're doing composition, regardless of whether we pay attention
to _how_.

Notebook-driven development tends to yield a sort of unbounded, non-linear
composition. Perhaps you've seen a notebook like this: the first couple cells
do imports and read in the data, then the rest form this goop of trial and
error, where you can tell from the cell numberings that they've been run out of
order, so it's totally unclear what the steps of the pipeline are, let alone
how they relate to and depend on each other, and the notebook reads like a
meandering run-on sentence, much like this one.

If this image isn't relatable, _good_. That probably means you've internalized
the importance of abstraction and have, at the very least, given your
processing steps names by putting them in functions. However, stopping there
fails to unlock the full potential of our abstractions. If we don't think about
the framework with which we'll compose them, we're doomed to maintain the
unbounded, non-linear composition that bogged us down before. Consider:

```python
df = pd.read_csv('data/initial_housing_data_RAW-2020JAN12.csv')
normalize_addresses(df)
df['avg_neighborhood_lot_size'] = avg_lot_size(df, by='neighborhood')
df = binarize_listing_status(df)
```

While we can make out the individual steps, the interfaces are all over the
place; one tweaks the data frame in place, another returns a series, and yet
another, a tweaked copy of the data frame. We're leaving value on the table by
not taking a more principled approach.  The guiding principle I suggest is
**design functions to be pipelined.** Pandas gives us a useful tool to steer us
in this direction: the [`DataFrame.pipe`][pipe docs] method.

[pipe docs]: https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.pipe.html

For our purposes, `DataFrame.pipe` allows you to chain function calls on a data
frame, but _only_ for functions which both take and return a data frame; they
must share an interface.

```python
df = pd.read_csv('data/initial_housing_data_RAW-2020JAN12.csv')
df_preprocessed = df.pipe(normalize_addresses)\
                    .pipe(avg_lot_size, by='neighborhood')\
                    .pipe(binarize_listing_status)
```

This reads almost like natural language. Moreover, it's constrained our
abstractions to a uniform interface: take a data frame and some parameters, and
return a data frame. We may be reluctant to sacrifice the flexibility of
programming to arbitrary interfaces, however, 1) it's a very small lift to get
our abstractions to conform to the common interface, and 2) making that small
effort will unlock additional expressive power.

To point (1): in the original formulation, `normalize_addresses` operated on
`df` in place and returned `None`. Adding `return df` to the end of the
function is the only change we need. Likewise, we need only include the
assignment step of `df['avg_neighborhood_lot_size']` and `return df` to make
`avg_lot_size` compliant.  `binarize_listing_status` already conformed.

To point (2): if the output is always a data frame, then we can mechanically
add serializing features like checkpointing to any or all of our processing
steps:

```python
from checkpoints import checkpoint

@checkpoint('data/preprocessed/housing.csv')
def normalize_addresses(df):
    ...
```

Now `normalize_addresses`  automatically caches its results to the specified
path. The same goes for any other processing step we decorate. This is critical
to the impact of long-running pipelines.  Failures are inevitable, but having a
checkpoint to resume from can save you hours when you restart the pipeline
following a crash.  Before we designed our functions for pipelining, the
diverging interfaces prevented us from taking a single approach to
checkpointing; we'd have to modify each function individually with custom
caching logic (or, more likely, exclude checkpoints altogether). Now, we can
just install the [`checkpoints` package][checkpoints] and sprinkle in a couple
decorators to make our big data pipelines more resilient and impactful.

[checkpoints]: https://github.com/wbadart/checkpoints

## Impact Multiplier #3: Reproducibility

Reproducibility is a key tenet of the scientific method, and striving to make
our results as reproducible as possible will yield better software and more
impactful analyses.

Your results are more than the sum of their source code. They are equally (and
implicitly) dependent on your compute environment.  Therefore, being able to
reproduce results entails being able to reproduce the environment. The
challenge is that an "environment," unlike the raw text of a source file, is a
rather abstract thing, encompassing the libraries used, their versions, your
Python installation, the state of the file system, and even the hardware used.
The complexity and importance of this challenge has led to a plethora of
solutions. Rather than detailing the options, allow me to explain the single
approach I've found to be the most broadly applicable and have the best
power-to-weight ratio: **write a Dockerfile and create a container**.

A [Docker container][docker docs] is essentially a diet virtual machine which
can be run on any host with the Docker runtime. This works because a container
is, as the name suggests, self-contained; we completely specify the needed
operating system, libraries, packages, and setup steps in a
[_Dockerfile_][dockerfile]. For example, if we've been good and maintained a
[requirements file][requirements] we can write:

```dockerfile
FROM python:3.7
WORKDIR /src
COPY . .
RUN pip install -r requirements.txt notebook
CMD jupyter notebook --allow-root
```

[docker docs]: https://docs.docker.com
[dockerfile]: https://docs.docker.com/engine/reference/builder
[requirements]: https://pip.pypa.io/en/stable/user_guide/#requirements-files

Anyone interested in recreating our results need only run:

```bash
docker build -t experiment:v1 .
docker run -p 8080:8080 experiment:v1
```

They will then be able to freely re-run our notebooks against the same OS, the
same Python version, the same libraries, the same files as ours; in an
environment which, for all intents and purposes, is identical to ours.
Suddenly, the reproduction of our environment goes from daunting and ad-hoc to
trivial and mechanical, greatly boosting our reproducibility and thusly impact.

Remarkably, those 5 lines of Dockerfile have made our analysis cloud-ready for
free. After running the above `docker build` command, one little `docker push`
can send your analysis to an AWS container registry, where it can be picked up
and run, for example, by Fargate.  With almost no overhead, we've enabled
innumerable highly-scalable deployment options for our client. Talk about
impact.

_See [simplegcn][simplegcn] for a Python project which uses a Dockerfile. In
this project's case, the Dockerfile enabled Travis CI to create an environment
for running tests._

[simplegcn]: https://github.com/wbadart/simplegcn

## Summary

Data science is still a relatively young field within computing. It faces
unique challenges not yet fully addressed by established methodologies. But
that doesn't mean they can't help. Remember:

- A notebook is a report. Use it as such. Do the heavy lifting in regular `.py`
  files and apply regular development processes (testing, version control,
  continuous integration, ...) to them.
- Design your abstractions to compose seamlessly.
- Docker is a ridiculously effective way to share your environment.  Write a
  Dockerfile today!

These software engineering recommendations, which entail surprisingly little
overhead, augment notebook-driven development in a way that makes the practice
of data science more rigorous, collaborative, and impactful.
